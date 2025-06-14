import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./customer/product-list/product-list.component').then(m => m.ProductListComponent)
    },
    {
        path: 'home',
        loadComponent: () => import('./home/home.component').then(m => m.HomeComponent)
    },
    {
        path: 'login',
        loadComponent: () => import('./admin/login/login.component').then(m => m.LoginComponent)
    },
    {
        path: 'orders',
        loadComponent: () => import('./admin/orders/orders.component').then(m => m.OrdersComponent)
    },
    {
        path: 'product-management',
        loadComponent: () => import('./admin/product-management/product-management.component').then(m => m.ProductManagementComponent)
    },
    {
        path: 'cart',
        loadComponent: () => import('./customer/cart/cart.component').then(m => m.CartComponent)
    },
    {
        path: 'checkout',
        loadComponent: () => import('./customer/checkout/checkout.component').then(m => m.CheckoutComponent)
    },
    {
        path: 'product-detail',
        loadComponent: () => import('./customer/product-detail/product-detail.component').then(m => m.ProductDetailComponent)
    },
    {
        path: 'product-list',
        loadComponent: () => import('./customer/product-list/product-list.component').then(m => m.ProductListComponent)
    },
    {
        path: 'product/:id', // dynamic route
        loadComponent: () => import('./customer/product-detail/product-detail.component').then(m => m.ProductDetailComponent)
    }

];
