import flask
import os
import json

a=flask.Flask(__name__)

@a.route('/executequery',methods=['GET','POST'])
def LoadData():
    s=flask.request.get_json()
    try:
        data=os.popen(s['query']).read()
        return(flask.jsonify(json.loads(data)))
    except Exception:
        data={"ERROR":"no data available."}
        return(flask.jsonify(data))

@a.route('/costbyaccountdaily',methods=['GET','POST'])
def LoadData1():
    s="steampipe query 'select * from aws.aws_cost_by_account_daily' --output json"
    try:
        data=os.popen(s).read()
        return(flask.jsonify(json.loads(data)))
    except Exception:
        data={"ERROR":"no data available."}
        return(flask.jsonify(data))

@a.route('/costbyaccountmonthly',methods=['GET','POST'])
def LoadData2():
    s="steampipe query 'select * from aws.aws_cost_by_account_monthly' --output json"
    try:
        data=os.popen(s).read()
        return(flask.jsonify(json.loads(data)))
    except Exception:
        data={"ERROR":"no data available."}
        return(flask.jsonify(data))

@a.route('/costbyrecordtypedaily',methods=['GET','POST'])
def LoadData3():
    s="steampipe query 'select * from aws.aws_cost_by_record_type_daily' --output json"
    try:
        data=os.popen(s).read()
        return(flask.jsonify(json.loads(data)))
    except Exception:
        data={"ERROR":"no data available."}
        return(flask.jsonify(data))

@a.route('/costbyrecordtypemonthly',methods=['GET','POST'])
def LoadData4():
    s="steampipe query 'select * from aws.aws_cost_by_record_type_monthly' --output json"
    try:
        data=os.popen(s).read()
        return(flask.jsonify(json.loads(data)))
    except Exception:
        data={"ERROR":"no data available."}
        return(flask.jsonify(data))

@a.route('/costbyservicedaily',methods=['GET','POST'])
def LoadData5():
    s="steampipe query 'select * from aws.aws_cost_by_service_daily' --output json"
    try:
        data=os.popen(s).read()
        return(flask.jsonify(json.loads(data)))
    except Exception:
        data={"ERROR":"no data available."}
        return(flask.jsonify(data))

@a.route('/costbyservicemonthly',methods=['GET','POST'])
def LoadData6():
    s="steampipe query 'select * from aws.aws_cost_by_service_monthly' --output json"
    try:
        data=os.popen(s).read()
        return(flask.jsonify(json.loads(data)))
    except Exception:
        data={"ERROR":"no data available."}
        return(flask.jsonify(data))
        
@a.route('/costbyserviceusagetypedaily',methods=['GET','POST'])
def LoadData7():
    s="steampipe query 'select * from aws.aws_cost_by_service_usage_type_daily' --output json"
    try:
        data=os.popen(s).read()
        return(flask.jsonify(json.loads(data)))
    except Exception:
        data={"ERROR":"no data available."}
        return(flask.jsonify(data))

@a.route('/costbyserviceusagetypemonthly',methods=['GET','POST'])
def LoadData8():
    s="steampipe query 'select * from aws.aws_cost_by_service_usage_type_monthly' --output json"
    try:
        data=os.popen(s).read()
        return(flask.jsonify(json.loads(data)))
    except Exception:
        data={"ERROR":"no data available."}
        return(flask.jsonify(data))

@a.route('/costforecastdaily',methods=['GET','POST'])
def LoadData9():
    s="steampipe query 'select * from aws.aws_cost_forecast_daily' --output json"
    try:
        data=os.popen(s).read()
        return(flask.jsonify(json.loads(data)))
    except Exception:
        data={"ERROR":"no data available."}
        return(flask.jsonify(data))

@a.route('/costforecastmonthly',methods=['GET','POST'])
def LoadData10():
    s="steampipe query 'select * from aws.aws_cost_forecast_monthly' --output json"
    try:
        data=os.popen(s).read()
        return(flask.jsonify(json.loads(data)))
    except Exception:
        data={"ERROR":"no data available."}
        return(flask.jsonify(data))

if __name__=='__main__':
    a.run(debug=True)
