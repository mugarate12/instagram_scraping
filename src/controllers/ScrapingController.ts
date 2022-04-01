import { Request, response, Response } from 'express'
import dotenv from 'dotenv'

import {
  browserOptions
} from './../utils'

import {
  scrapingService
} from './../services'

import {
  Scraping
} from './../database/models'

dotenv.config()

export default class ScrapingController {
  public routine = async () => {
    const url = String(process.env.INSTAGRAM_TO_SCRAP)
    const totalOfGrids = 3

    const browser = await browserOptions.runBrowser()

    await scrapingService.loginInInstagram(browser)

    const result = await scrapingService.getPostsImagesSourcesAndReferences(browser, url, totalOfGrids)
    const posts = await scrapingService.getPostsContent(browser, result)

    await scrapingService.updateData(posts)

    await browserOptions.closeBrowser(browser)
    
    return posts
  }

  public get = async (req: Request, res: Response) => {
    const posts = await Scraping.findAll({
      attributes: [ 'id', 'content', 'ref', 'source' ]
    })

    return res.status(200).json({
      posts: posts
    })
  }

  public test = async (req: Request, res: Response) => {
    await this.routine()

    return res.status(200).json({})
  }
}