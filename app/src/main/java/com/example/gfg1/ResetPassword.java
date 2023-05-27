package com.example.gfg1;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.widget.EditText;
import android.widget.TextView;

public class ResetPassword extends AppCompatActivity {

    EditText enterpwd,enterconformpwd;
    TextView reset;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_reset_password);

        enterpwd = (EditText) findViewById(R.id.enterpwd);
        enterconformpwd = (EditText) findViewById(R.id.enterconformpwd);
        reset = (TextView) findViewById(R.id.reset);

        Intent i = new Intent(ResetPassword.this,login.class);
        startActivity(i);
    }
}