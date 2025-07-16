import { Routes } from '@angular/router';
import { nonAuthGuard } from './guard/non-auth.guard';
import { authGuard } from './guard/auth.guard';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./customer/product-list/product-list.component').then(m => m.ProductListComponent)
    },
    {
        path: 'home',
        loadComponent: () => import('./home/home.component').then(m => m.HomeComponent),
        //canActivate: [authGuard]
    },
    {
        path: 'login',
        loadComponent: () => import('./admin/login/login.component').then(m => m.LoginComponent),
        //canActivate: [nonAuthGuard]
    },
    {
        path: 'orders',
        loadComponent: () => import('./admin/orders/orders.component').then(m => m.OrdersComponent),
        //canActivate: [nonAuthGuard]
    },
    {
        path: 'product-management',
        loadComponent: () => import('./admin/product-management/product-management.component').then(m => m.ProductManagementComponent),
        canActivate: [authGuard]
    },
    {
        path: 'cart',
        loadComponent: () => import('./customer/cart/cart.component').then(m => m.CartComponent),
        //canActivate: [authGuard]
    },
    {
        path: 'checkout',
        loadComponent: () => import('./customer/checkout/checkout.component').then(m => m.CheckoutComponent),
        //canActivate: [authGuard]
    },
    {
        path: 'product-detail',
        loadComponent: () => import('./customer/product-detail/product-detail.component').then(m => m.ProductDetailComponent),
        //canActivate: [authGuard]
    },
    {
        path: 'product-list',
        loadComponent: () => import('./customer/product-list/product-list.component').then(m => m.ProductListComponent),
        canActivate: [nonAuthGuard]
    },
    {
        path: 'product/:id', // dynamic route
        loadComponent: () => import('./customer/product-detail/product-detail.component').then(m => m.ProductDetailComponent),
        //canActivate: [authGuard]
    },
    {
        path: 'product-check',
        loadComponent: () => import('./customer/product-check/product-check.component').then(m => m.ProductCheckComponent),
        //canActivate: [authGuard]
    }

];
