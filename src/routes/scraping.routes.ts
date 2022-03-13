import { Router } from 'express'

import {
  scrapingController
} from './../controllers'

export default function scrapingRoutes(routes: Router) {
  routes.get('/test', scrapingController.test)

  routes.get('/posts', scrapingController.get)
}