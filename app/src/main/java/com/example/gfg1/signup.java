package com.example.gfg1;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.EditText;
import android.widget.TextView;

public class signup extends AppCompatActivity {

    EditText entername,enteremail,enterpass,enterrepass;
    TextView mainsignup;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_signup);

        entername = (EditText) findViewById(R.id.entername);
        enteremail = (EditText) findViewById(R.id.enteremail);
        enterpass = (EditText) findViewById(R.id.enterpass);
        enterrepass = (EditText) findViewById(R.id.enterrepass);

        mainsignup = (TextView) findViewById(R.id.mainsignup);

        mainsignup.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent i = new Intent(signup.this,login.class);
                startActivity(i);
            }
        });

    }
}