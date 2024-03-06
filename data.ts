import { list } from "postcss"

interface LinksAside {
    title:string,
    link:string,
    icon:string
}
export const linksAside: LinksAside[] = [
    {
        title: 'dashboard',
        link:'#',
        icon: 'Home'
    },
    {
        title: 'products List',
        link:'/admin/products',
        icon: 'Package'

    },
    {
        title: 'product',
        link:'/admin/products/form',
        icon: 'Box'

    },
    {
        title: 'orders',
        link:'/admin/orders',
        icon: 'FileSpreadsheet'
    },
]

export const linksAsideShop: LinksAside[] = [
    {
        title: 'Home',
        icon: 'Home',
        link:'/shop'
    },
    {
        title: 'Search',
        icon: 'PackageSearch',
        link:'/shop/search'
    },
    {
        title: 'My Favorites',
        icon: 'Heart',
        link:'/shop/favorite'
    },
    {
        title: 'My Orders',
        icon: 'ShoppingBag',
        link:'/shop/order'
    },
] 