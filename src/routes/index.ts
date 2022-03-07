import { Router } from 'express'

import scrapingRoutes from "./scraping.routes"

const routes = Router()

scrapingRoutes(routes)

export default routes
