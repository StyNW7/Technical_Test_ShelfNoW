import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import axios from 'axios';

@Injectable()
export class GatewayService {
  private services = {
    'auth-service': 'http://auth-service:3001',
    'product-service': 'http://product-service:3002',
    'order-service': 'http://order-service:3003',
  };

  async proxyRequest(
    res: Response,
    serviceName: string,
    path: string,
    method: string = 'GET',
    body?: any,
    headers?: any,
  ): Promise<void> {
    const serviceUrl = this.services[serviceName];
    
    if (!serviceUrl) {
      res.status(502).json({ error: 'Service unavailable' });
      return;
    }

    try {
      const url = `${serviceUrl}/${path}`;

      const isDataAllowed = method !== 'GET' && method !== 'DELETE';

      const config = {
        method,
        url,
        data: isDataAllowed ? body : undefined,
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        timeout: 5000,
      };

      console.log(`Proxying ${method} ${path} to ${serviceName}`);
      
      const response = await axios(config);
      
      // Add CORS headers to the response
      res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
      res.header('Access-Control-Allow-Credentials', 'true');
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      
      res.status(response.status).json(response.data);
      
    } catch (error: any) {
      console.error(`Gateway error for ${serviceName}:`, error.message);
      
      res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
      res.header('Access-Control-Allow-Credentials', 'true');
      
      if (error.code === 'ECONNREFUSED') {
        res.status(503).json({ 
          error: 'Service temporarily unavailable',
          service: serviceName
        });
      } else if (error.response) {
        res.status(error.response.status).json(error.response.data);
      } else {
        res.status(500).json({ 
          error: 'Internal gateway error',
          message: error.message 
        });
      }
    }
  }
}