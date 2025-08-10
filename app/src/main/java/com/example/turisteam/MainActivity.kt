package com.example.turisteam

import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.example.turisteam.databinding.ActivityMainBinding

class MainActivity : AppCompatActivity() {
    private lateinit var binding: ActivityMainBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)
        
        setupToolbar()
        setupButtons()
    }
    
    private fun setupToolbar() {
        setSupportActionBar(binding.toolbar)
    }
    
    private fun setupButtons() {
        binding.btnTeams.setOnClickListener {
            Toast.makeText(this, "Funcionalidad de Equipos próximamente", Toast.LENGTH_SHORT).show()
        }
        
        binding.btnNews.setOnClickListener {
            Toast.makeText(this, "Funcionalidad de Noticias próximamente", Toast.LENGTH_SHORT).show()
        }
        
        binding.btnChat.setOnClickListener {
            Toast.makeText(this, "Funcionalidad de Chat próximamente", Toast.LENGTH_SHORT).show()
        }
        
        binding.btnMedia.setOnClickListener {
            Toast.makeText(this, "Funcionalidad de Media próximamente", Toast.LENGTH_SHORT).show()
        }
    }
}