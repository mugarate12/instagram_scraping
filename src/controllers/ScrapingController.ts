import { Request, Response } from 'express'
import puppeteer from 'puppeteer'
import dotenv from 'dotenv'

import {
  browserOptions
} from './../utils'

dotenv.config()

interface postsSourceInterface {
  imageSource: string
  postRef: string
}

interface postsContentInterface {
  imageSource: string
  postRef: string,
  content: string
}

export default class ScrapingController {
  private url = 'https://www.instagram.com/raiocelular/'
  // each grid conteins three posts, then total is 3 (for example) get 9 posts
  private totalOfGrids = 3

  private sleep = (seconds: number) => {
    return new Promise(resolve => setTimeout(resolve, 1000 * seconds))
  }

  private loginInInstagram = async (browser: puppeteer.Browser) => {
    const url = 'https://www.instagram.com'
    const page = await browserOptions.newPage(browser)

    await page.goto(url, { waitUntil: [ 'load', 'networkidle0' ] })

    await page.type("input[name='username']", String(process.env.INSTAGRAM_USER), {  delay: 50 })
    await page.type("input[name='password']", String(process.env.INSTAGRAM_PASSWORD), {  delay: 50 })

    await page.click('#loginForm > div > div:nth-child(3) > button > div')

    await this.sleep(10)
  }

  /**
   * @summary return a total of posts based of totalOfGrids property, but, if instagram not have this total of posts, get more of possible
   * @param browser browser instance to make all requests
   * @returns content of posts
   */
  private getPostsImagesSourcesAndReferences = async (browser: puppeteer.Browser) => {
    const page = await browserOptions.newPage(browser)

    await page.goto(this.url)

    const result: Array<postsSourceInterface> = await page.evaluate((totalOfGrids) => {
      let result = [
        {
          imageSource: '',
          postRef: ''
        }
      ]

      // get image source and post href for each post in grid of three elements
      function getElements(grid, result) {
        Object.keys(grid.children).forEach((_, index) => {
          const post = grid.children[index]
  
          let href = String(post.children[0]['href'])
          let src = String(post.children[0].children[0].children[0].children[0]['src'])
  
          result.push({
            imageSource: src,
            postRef: href
          })
        })
      }
      
      let content = document.getElementsByClassName('ySN3v')[0]
      let contentDiv = content.children[0]
      let subContentDiv = contentDiv.children[0]
      let gridOfContent = subContentDiv.children

      for (let index = 0; index < Object.keys(gridOfContent).length; index++) {
        const grid = gridOfContent[index]
        
        if ((index + 1) > totalOfGrids) {
          break
        } 

        getElements(grid, result)
      }

      return result.slice(1, result.length)
    }, this.totalOfGrids)

    return result
  }

  private getPostsContent = async (browser: puppeteer.Browser, postsSources: Array<postsSourceInterface>) => {
    let result: Array<postsContentInterface> = []

    for (let index = 0; index < postsSources.length; index++) {
      const postSource = postsSources[index]
      
      const postPage = await browserOptions.newPage(browser)

      let tryGoToPage = 0
      let sucess = false
      
      while (tryGoToPage < 5 && !sucess) {
        await postPage.goto(postSource.postRef, { waitUntil: 'load' })
          .then(response => {
            console.log(response.status());

            if (response.status() === 200) {
              sucess = true
            }
          })
          .catch(error => {
            console.log('go to page error: ', error)
          })

        tryGoToPage += 1
      }

      const postText = await postPage.evaluate(() => {
        let result = ''

        let spanWithText = document.getElementsByClassName('_7UhW9   xLCgt      MMzan   KV-D4           se6yk       T0kll ')[0]

        if (!!spanWithText) {
          result = String(spanWithText.textContent)
        }

        return result
      })

      result.push({
        ...postSource,
        content: postText
      })

      await this.sleep(5)

      await postPage.close()
    }

    return result
  }

  public test = async (req: Request, res: Response) => {
    const browser = await browserOptions.runBrowser()
    const page = await browserOptions.newPage(browser)

    await this.loginInInstagram(browser)
    
    const result = await this.getPostsImagesSourcesAndReferences(browser)
    // await this.sleep(5)
    const posts = await this.getPostsContent(browser, result)
    
    await browserOptions.closeBrowser(browser)

    return res.status(200).json({
      resultado: posts,
      // postText
    })
  }
}