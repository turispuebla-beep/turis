package com.cdsanabriacf.app

import android.app.Application
import com.google.firebase.FirebaseApp

class CDSANABRIACFApp : Application() {
    override fun onCreate() {
        super.onCreate()
        FirebaseApp.initializeApp(this)
    }
}