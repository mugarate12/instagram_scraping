import puppeteer from 'puppeteer'
import dotenv from 'dotenv'
import path from 'path'
import fs from 'fs'

import {
  Scraping
} from './../database/models'

import {
  browserOptions,
  logger
} from './../utils'

import constants from '../config/constants'

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

export default class ScrapingService {
  private sleep = (seconds: number) => {
    return new Promise(resolve => setTimeout(resolve, 1000 * seconds))
  }

  private goToPage = async (browser: puppeteer.Browser, url: string) => {
    const page = await browserOptions.newPage(browser)

    let tryGoToPage = 0
    let sucess = false

    while (tryGoToPage < 5 && !sucess) {
      await page.goto(url, { waitUntil: ['networkidle0', 'load'] })
        .then(response => {
          logger.info(`status: ${response.status()}, url: ${url}`);

          if (response.status() === 200) {
            sucess = true
          }
        })
        .catch(error => {
          logger.error('go to page error: ', error)
        })

      tryGoToPage += 1
    }

    return page
  }

  /**
   * @description get and save all images to directory constants.directiries.postsImages
   * @param browser instance of browser to open page of image
   * @param postRef reference of post to create id of image
   * @param postImageSrc source or link of image
   */
  private getPostImage = async (browser: puppeteer.Browser, postRef: string, postImageSrc: string) => {
    const page = await browserOptions.newPage(browser)
    
    fs.mkdirSync(constants.directories.postsImages, { recursive: true })

    await page.goto(postImageSrc, { waitUntil: ['networkidle0', 'load'] })

    let reference = path.basename(postRef)
    
    logger.info(`post ref: ${postRef}, post ref process: ${reference}`)
    const basePath = String(process.env.BASE_URL_TO_MOUNT_IMAGE_REFERENCE)
    const filename = `${reference}.png`
    const filepath = path.resolve(constants.directories.postsImages, filename)
    
    const imageReference = `${basePath}/${filename}`

    logger.info(`filepath: ${imageReference}`)

    await page.screenshot({ path: filepath, fullPage: true })
    await page.close()

    return imageReference
  }

  /**
   * @description log in instagram base in .env variables INSTAGRAM_USER and INSTAGRAM_PASSWORD
   */
  public loginInInstagram = async (browser: puppeteer.Browser) => {
    const url = 'https://www.instagram.com'
    const page = await this.goToPage(browser, url)

    await page.type("input[name='username']", String(process.env.INSTAGRAM_USER), {  delay: 50 })
    await page.type("input[name='password']", String(process.env.INSTAGRAM_PASSWORD), {  delay: 50 })

    await page.click('#loginForm > div > div:nth-child(3) > button > div')

    await this.sleep(10)

    await page.close()
  }

  /**
   * @summary return a total of posts based of totalOfGrids property, but, if instagram not have this total of posts, get more of possible
   * @param browser browser instance to make all requests
   * @returns content of posts
   */
   public getPostsImagesSourcesAndReferences = async (browser: puppeteer.Browser, url: string, totalOfGrids: number) => {
    const page = await this.goToPage(browser, url)
    logger.info(`first step: get posts images sources and references \n page: ${url}`)

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
    }, totalOfGrids)

    await page.close()

    return result
  }

  /**
   * @param browser browser instance to make all requests
   * @returns content of posts with text content of post and create image of each post in postsImages directory
   */
  public getPostsContent = async (browser: puppeteer.Browser, postsSources: Array<postsSourceInterface>) => {
    let result: Array<postsContentInterface> = []

    for (let index = 0; index < postsSources.length; index++) {
      const postSource = postsSources[index];
      let content = ''
      let success = false
      let tryAgainGetContent = 0

      while (tryAgainGetContent <= 5 && !success && !content) {
        const postPage = await this.goToPage(browser, postSource.postRef)
        
        await postPage.evaluate(() => {
          let result = ''
  
          let spanWithText = document.getElementsByClassName('_7UhW9   xLCgt      MMzan   KV-D4           se6yk       T0kll ')[0]
  
          if (!!spanWithText) {
            result = String(spanWithText.textContent)
          }
  
          return result
        })
          .then(async (response) => {
            content = response
            success = true
            
            await postPage.close()
          })
          .catch(() => {
            tryAgainGetContent += 1
          })
      }
        
      result.push({
        ...postSource,
        content
      })
    }

    logger.info(`dir: ${constants.directories.postsImages}`)
    logger.info("creating posts images...")
    const directoryExists = fs.existsSync(constants.directories.postsImages)

    if (directoryExists) {
      fs.rmdirSync(constants.directories.postsImages, { recursive: true })
      fs.mkdirSync(constants.directories.postsImages, { recursive: true })
    } else {
      fs.mkdirSync(constants.directories.postsImages, { recursive: true })
    }
    
    for (let index = 0; index < result.length; index++) {
      const post = result[index]
      
      const postImageReference = await this.getPostImage(browser, post.postRef, post.imageSource)

      result[index] = {
        ...post,
        imageSource: postImageReference
      }
    }

    return result
  }

  /**
   * @description use this to update data of posts in database
   * @param postsContent content of posts with text content of post and create image of each post in postsImages directory
   */
  public updateData = async (postsContent: Array<postsContentInterface>) => {
    if (postsContent.length > 0) {
      // delete all data
      await Scraping.destroy({
        truncate: true,
        force: true
      })
  
      const requests = postsContent.map(async (post) => {
        await Scraping.create({
          content: post.content,
          ref: post.postRef,
          source: post.imageSource
        })
      })
  
      await Promise.all(requests)
    }
  }
}