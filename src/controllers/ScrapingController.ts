import { Request, response, Response } from 'express'
import puppeteer from 'puppeteer'
import dotenv from 'dotenv'
import path from 'path'
import fs from 'fs'

import {
  browserOptions,
  logger
} from './../utils'

import {
  scrapingService
} from './../services'

import {
  Scraping
} from './../database/models'

import constants from './../config/constants'

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
  private updateData = async (postsContent: Array<postsContentInterface>) => {
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

  public routine = async () => {
    const url = String(process.env.INSTAGRAM_TO_SCRAP)
    const totalOfGrids = 3

    const browser = await browserOptions.runBrowser()

    await scrapingService.loginInInstagram(browser)

    const result = await scrapingService.getPostsImagesSourcesAndReferences(browser, url, totalOfGrids)
    const posts = await scrapingService.getPostsContent(browser, result)

    await this.updateData(posts)
    return posts
  }

  public get = async (req: Request, res: Response) => {
    const posts = await Scraping.findAll({
      attributes: [ 'id', 'content', 'ref', 'source' ]
    })

    return res.status(200).json({
      data: posts
    })
  }

  public test = async (req: Request, res: Response) => {
    await this.routine()

    return res.status(200).json({})
  }
}