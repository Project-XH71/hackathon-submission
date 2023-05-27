package com.example.gfg1;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.view.WindowManager;
import android.widget.Button;
import android.widget.EditText;
import android.widget.RatingBar;
import android.widget.TextView;

public class feedback extends AppCompatActivity {
    RatingBar rating;
    TextView btn_Rateus;
    EditText sugestus;
    String uid;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_feedback);

        getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN,WindowManager.LayoutParams.FLAG_FULLSCREEN);
        setContentView(R.layout.activity_feedback);


        if (!SharedPrefManager.getInstance(this).isLoggedIn()) {
            startActivity(new Intent(feedback.this, login.class));
            finish();
        }
        rating = findViewById(R.id.ratingbar);
        btn_Rateus = findViewById(R.id.RateUs);
        sugestus = findViewById(R.id.suggest);

    }
}