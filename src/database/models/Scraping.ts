import { 
  DataTypes, 
  Model, 
  Optional
} from 'sequelize'
import connection from '../../config/sequelize'

interface ScrapingAttributes {
  id: number,
  source: string,
  ref: string,
  content: string
}

export interface ScrapingInput extends Optional<ScrapingAttributes, 'id'> {}
export interface ScrapingOutput extends Required<ScrapingAttributes> {}

class Scraping extends Model<ScrapingAttributes, ScrapingInput> implements ScrapingAttributes {
  public id!: number

  public source!: string
  public ref!: string
  public content!: string

  // timestamps!
  public readonly createdAt!: Date
  public readonly updatedAt!: Date
  public readonly deletedAt!: Date
}

Scraping.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  ref: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  source: {
    type: DataTypes.TEXT,
    allowNull: false
  }
}, {
  timestamps: true,
  sequelize: connection,
  paranoid: true
})

export default Scraping
