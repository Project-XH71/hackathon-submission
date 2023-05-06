

# HealthSync Documentation
 

***Note: As of May 6, 14:58 PM IST, Team HealthSync has made the decision to turn off all the Google Cloud instances, including the Database, API, and WebApp instances, as per the instructions provided on the GFG Hackathon Communication Channel. If you have any queries, please email the Team Admin.***



Technical Documentation: [HealthSync Documentation](https://docs.google.com/document/d/1Xl0Dd5wIKFGRdx8WGrb7Erw2yoQUQkSfPzJdV_I5hhI/edit?usp=sharing)

API Documentation: [Postman Documentation](https://documenter.getpostman.com/view/26537798/2s93RUvC6E)


## Introduction

[![Watch the Introduction Video](https://drive.google.com/uc?export=download&id=1WOqDWYPn2JzkPCe2Fqi7-LipdmVj4YF8)](https://drive.google.com/file/d/1Egxe-YUJ4Z-35ID-Osv-8inoQf6-Bxq8/view?usp=sharing)


Our healthcare project aims to establish a comprehensive digital health infrastructure by creating a cloud-based Electronic Health Record (EHR) platform. It goes beyond a simple application by incorporating cutting-edge technologies such as data security, AI, and ML.

One of the key features of our solution is the allocation of a Virtual Personal Assistant (VPA) to each individual, linked with their unique Aadhar Card Number, following the "One Person, One Identity" concept.

Our platform includes a Health Sync app that doctors can install on their phones. Users can scan a QR code to seamlessly share their medical history with the doctor during their treatment, improving the efficiency of healthcare delivery.

To ensure the utmost security of patient medical data, we utilize AES encryption when storing data in the database, guaranteeing its protection even in the event of a potential data breach.

Our infrastructure is powered by advanced technologies, including AI capabilities. Modules and services incorporated within our EHR platform encompass data integration, NLP for efficient processing of clinical notes, CDS for real-time clinical decision support, predictive analytics for disease progression and medication effectiveness, image and signal analysis for accurate diagnosis, and personalized medicine for individualized treatment plans.

We have leveraged powerful hardware resources such as AMD N2D 4CPU and 8GB Memory Google Instances to enhance our services. Additionally, we rely on Redis, ProgresSQL, Google Analytics Engine, Map API, and other Google services to ensure the stability and management of our application.

Our platform's unique aspect lies in its emphasis on data analytics and data security, both of which are detailed extensively in our Technical Documentation available on GitHub. We conduct regular cloud benchmarks to ensure compliance with regulatory frameworks such as RBI and CISF laws, further enhancing the reliability and trustworthiness of our infrastructure.


## Technology

 1. NodeJS
 2. ExpressJS
 3. Prisma 
 4. GraphAPI
 5. GCP SDK
 6. Postgres Database
 7. Redis (For Session Controlling)
 8. Advance Cryptographic
 9. ReactJS
 10. Tailwind
 11. Vite
 1. Admin Dashboard by Mosaic
   
## Production

 - Services: **Google Cloud Platform**
 - Instance Compute Type: **AMD Rome**
 - GPU's: **NaN**
 - Architecture: **x86/64**
 - Machine type: **n2d-standard-2**
 - Memory:   **8 GiB**
 - vCPU's: **2**


## Security

### Modules:

 1. AES Encryption on CBC Mode
 2. Role Based Access Control (RBAC)
 3. Secure Database on  Subnet on Google VPC.
 4. Security Control Middleware on Layer 7

## Google Cloud Deployment Configuration

![Google Cloud Configuration Image](https://drive.google.com/uc?export=download&id=1hGMhu9vSX4qErUj9emngR1q6h6dW7esH)

 - Instance Compute Type: **AMD Rome**
 - GPU's: **NaN**
 - Architecture: **x86/64**
 - Machine type: **n2d-standard-2**
 - Memory:   **8 GiB**
 - vCPU's: **2**

## Security Architecture:
![High Level View of Data Security Flow](https://drive.google.com/uc?export=download&id=1FcLgAy0Y7qx2s1paKgYXf_fAjCdWu29m)
High Level View of Data Security Flow
 

## Database

 ![DB Design](https://drive.google.com/uc?export=download&id=12fzTGApnch2FBI7Qtag4Yi6FY7znib8e)


![ER Diagram](https://drive.google.com/uc?export=download&id=1M68A-itOkNa-6lm6wPtdYTUyHy8UfsTf)



