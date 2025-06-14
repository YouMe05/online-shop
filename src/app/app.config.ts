import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideFirebaseApp, getApp, initializeApp } from '@angular/fire/app';
import { provideDatabase, getDatabase } from '@angular/fire/database';

const firebaseConfig = {
  apiKey: "AIzaSyDJK7_zu2qRVclghQ78dTRCusREnRRG_7Y",
  authDomain: "online-shop-1ec5c.firebaseapp.com",
  projectId: "online-shop-1ec5c",
  storageBucket: "online-shop-1ec5c.firebasestorage.app",
  messagingSenderId: "822262016271",
  appId: "1:822262016271:web:b3704890e0145feff7f67a",
  measurementId: "G-6Q2LM4Y24K"
};

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideDatabase(() => getDatabase()),
  ]
};
