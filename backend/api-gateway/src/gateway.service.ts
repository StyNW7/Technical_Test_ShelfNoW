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
    ['checkout-service', { url: 'http://checkout-service:3003', timeout: 8000 }],
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
      const config = {
        method,
        url,
        data: body,
        headers: {
          ...headers,
          'Content-Type': 'application/json',
        },
        timeout: service.timeout,
      };

      const response = await axios(config);
      res.status(response.status).json(response.data);
    } catch (error) {
      if (error.response) {
        // Service responded with error status
        res.status(error.response.status).json(error.response.data);
      } else if (error.request) {
        // Service unavailable
        res.status(503).json({ error: 'Service temporarily unavailable' });
      } else {
        // Other errors
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }
}