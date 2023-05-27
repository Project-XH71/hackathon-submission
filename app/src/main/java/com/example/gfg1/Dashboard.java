package com.example.gfg1;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.ImageView;

public class Dashboard extends AppCompatActivity {

    ImageView scan,hospital,medicine,labtest,articles,feedback;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_dashboard);

        scan = (ImageView) findViewById(R.id.scan);
        hospital = (ImageView) findViewById(R.id.hospital);
        medicine = (ImageView) findViewById(R.id.medicine);
        labtest = (ImageView) findViewById(R.id.labtest);
        articles = (ImageView) findViewById(R.id.articles);
        feedback = (ImageView) findViewById(R.id.feedback);

        scan.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent i = new Intent(Dashboard.this,scan.class);
                startActivity(i);
            }
        });

        hospital.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent i = new Intent(Dashboard.this,hospital.class);
                startActivity(i);
            }
        });

        medicine.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent i = new Intent(Dashboard.this, medicine.class);
                startActivity(i);
            }
        });
        labtest.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent i = new Intent(Dashboard.this, labtest.class);
                startActivity(i);
            }
        });
        articles.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent i = new Intent(Dashboard.this, articles.class);
                startActivity(i);
            }
        });
        feedback.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent i = new Intent(Dashboard.this, feedback.class);
                startActivity(i);
            }
        });
    }
}