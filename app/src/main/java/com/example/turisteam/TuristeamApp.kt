package com.example.turisteam

import android.app.Application
import com.google.firebase.FirebaseApp

class TuristeamApp : Application() {
    override fun onCreate() {
        super.onCreate()
        FirebaseApp.initializeApp(this)
    }
}