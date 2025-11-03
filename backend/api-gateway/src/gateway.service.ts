import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import axios from 'axios';

interface ServiceConfig {
  url: string;
  timeout: number;
}

@Injectable()
export class GatewayService {
  private services: Map<string, ServiceConfig> = new Map([
    ['auth-service', { url: 'http://auth-service:3001', timeout: 5000 }],
    ['product-service', { url: 'http://product-service:3002', timeout: 5000 }],
    ['order-service', { url: 'http://order-service:3003', timeout: 8000 }],
  ]);

  async proxyRequest(
    res: Response,
    serviceName: string,
    path: string,
    method: string = 'GET',
    body?: any,
    headers?: any,
  ): Promise<void> {
    const service = this.services.get(serviceName);
    
    if (!service) {
      res.status(502).json({ error: 'Service unavailable' });
      return;
    }

    try {
      const url = `${service.url}/${path}`;
      
      // Prepare headers
      const requestHeaders = {
        'Content-Type': 'application/json',
        ...headers,
      };

      const config = {
        method,
        url,
        data: body,
        headers: requestHeaders,
        timeout: service.timeout,
        validateStatus: () => true, // Don't throw on HTTP errors
      };

      console.log(`Proxying ${method} ${path} to ${serviceName}`);
      
      const response = await axios(config);
      
      // Forward the exact response from the service
      res.status(response.status).json(response.data);
      
    } catch (error) {
      console.error(`Gateway error for ${serviceName}:`, error.message);
      
      if (error.code === 'ECONNREFUSED') {
        res.status(503).json({ 
          error: 'Service temporarily unavailable',
          message: `${serviceName} is not responding` 
        });
      } else if (error.response) {
        // Service responded with error status
        res.status(error.response.status).json(error.response.data);
      } else {
        // Other errors
        res.status(500).json({ 
          error: 'Internal gateway error',
          message: error.message 
        });
      }
    }
  }
}