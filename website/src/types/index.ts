export interface MenuItem {
  name: string
  description?: string
  descriptionEn?: string
  price?: string
  vegetarian?: boolean
  image?: string
  menus?: ('dineIn' | 'takeOut')[]
}

export interface MenuCategory {
  id: string
  label: string
  sublabel?: string
  labelFr?: string
  sublabelFr?: string
  items: MenuItem[]
}

export interface StatItem {
  value: number
  suffix: string
  label: string
  decimals?: number
}

export interface NavLink {
  label: string
  to: string
}
