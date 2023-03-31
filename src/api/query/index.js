const express = require('express');
const router = express.Router();
const { verifySession } = require("supertokens-node/recipe/session/framework/express");
const axios = require('axios');
const baseUrl = "http://43.204.227.242:5000";


router.get('/status', verifySession(), (req, res) => res.send('Welcome to Admin API'));


router.get('/aws/:query',verifySession(), async (req, res) => {
   
    if (req.params.query === "montly-unblended-cost") {
        const data = JSON.stringify({
            "query": "steampipe query \"select period_start, dimension_1 as account_id, dimension_2 as record_type, net_unblended_cost_amount::numeric::money from aws_cost_usage where granularity = 'MONTHLY' and dimension_type_1 = 'LINKED_ACCOUNT' and dimension_type_2 = 'RECORD_TYPE' and dimension_2 in ('DiscountedUsage', 'Credit') order by dimension_1, period_start;\" --output json"
          });
    
        const config = {
            method: 'get',
            url: 'http://43.204.227.242:5000/executequery',
            headers: { 
              'Content-Type': 'application/json'
            },
            data : data
          };
        
        // let awsdata;
    
        const awsdata = await axios(config);
    
        return res.status(200).send(awsdata.data)
    }


    else if(req.params.query === "compute-instance-metric-hourly"){
      const data = JSON.stringify({
        "query": "steampipe query 'select * from aws.aws_ec2_instance_metric_cpu_utilization_hourly' --output json"
      });

      const config = {
          method: 'get',
          url: 'http://43.204.227.242:5000/executequery',
          headers: { 
            'Content-Type': 'application/json'
          },
          data : data
        };
    
        // let awsdata;

        const awsdata = await axios(config);

        return res.status(200).send(awsdata.data)
    }

    else if(req.params.query === "compute-instance-over-80-percentage"){
      const data = JSON.stringify({
        "query":"steampipe query 'select instance_id, timestamp, round(minimum::numeric,2) as min_cpu, round(maximum::numeric,2) as max_cpu, round(average::numeric,2) as avg_cpu, sample_count from aws_ec2_instance_metric_cpu_utilization where average > 80 order by instance_id, timestamp;' --output json"
    });

      const config = {
          method: 'get',
          url: 'http://43.204.227.242:5000/executequery',
          headers: { 
            'Content-Type': 'application/json'
          },
          data : data
        };
    
        // let awsdata;

        const awsdata = await axios(config);

        return res.status(200).send(awsdata.data)
    }

    else if(req.params.query === "compute-instance-monitoring-disabled"){
        const data = JSON.stringify({
          "query":"steampipe query \"select * from aws_ec2_instance where monitoring_state = 'disabled';\" --output json"
      });

      const config = {
          method: 'get',
          url: 'http://43.204.227.242:5000/executequery',
          headers: { 
            'Content-Type': 'application/json'
          },
          data : data
        };
    
        // let awsdata;

        const awsdata = await axios(config);

        return res.status(200).send(awsdata.data)
    }

    else if (req.params.query === "compute-instance-stopped-30") {
      const data = JSON.stringify({
        "query":"steampipe query \"select * from aws_ec2_instance where monitoring_state = 'disabled';\" --output json"
    });

    const config = {
        method: 'get',
        url: 'http://43.204.227.242:5000/executequery',
        headers: { 
          'Content-Type': 'application/json'
        },
        data : data
      };
  
      // let awsdata;

      const awsdata = await axios(config);

      return res.status(200).send(awsdata.data)
    }

    else if (req.params.query === "cost-acc-daily") {
      const data = JSON.stringify({
        "query":"steampipe query 'select account_id,net_amortized_cost_amount,net_unblended_cost_amount, usage_quantity_amount from aws.aws_cost_by_account_daily' --output json"
    });

    const config = {
        method: 'get',
        url: 'http://43.204.227.242:5000/executequery',
        headers: { 
          'Content-Type': 'application/json'
        },
        data : data
      };
  
      // let awsdata;

      const awsdata = await axios(config);

      return res.status(200).send(awsdata.data)
    }


    else return res.status(200).send("No data found")
      
});

module.exports = router;