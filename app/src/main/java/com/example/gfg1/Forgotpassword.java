package com.example.gfg1;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.EditText;
import android.widget.TextView;

public class Forgotpassword extends AppCompatActivity {

    TextView submit;
    EditText enterregemail;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_forgotpassword);

        submit = (TextView) findViewById(R.id.submitres);
        enterregemail = (EditText) findViewById(R.id.enterregemail);

        submit.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent in = new Intent(Forgotpassword.this,ResetPassword.class);
                startActivity(in);
            }
        });
    }
}