import axios from 'axios';
import { config } from '../config';

export interface TeamDomain {
  teamId: string;
  name: string;
  subdomain: string;
  isActive: boolean;
  createdAt: Date;
  adminEmail: string;
}

export class DomainManager {
  private baseUrl = config.apiUrl;

  generateSubdomain(teamName: string): string {
    return teamName
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }

  async isSubdomainAvailable(subdomain: string): Promise<boolean> {
    try {
      const response = await axios.get(`${this.baseUrl}/domains/check/${subdomain}`);
      return response.data.available;
    } catch (error) {
      console.error('Error checking subdomain availability:', error);
      throw error;
    }
  }

  async createTeamSubdomain(team: TeamDomain): Promise<void> {
    try {
      const subdomain = this.generateSubdomain(team.name);
      
      if (!await this.isSubdomainAvailable(subdomain)) {
        throw new Error(`El subdominio ${subdomain} no está disponible`);
      }

      await axios.post(`${this.baseUrl}/domains/create`, {
        teamId: team.teamId,
        subdomain,
        adminEmail: team.adminEmail
      });

    } catch (error) {
      console.error('Error creating team subdomain:', error);
      throw error;
    }
  }

  async getTeamDomain(teamId: string): Promise<TeamDomain> {
    try {
      const response = await axios.get(`${this.baseUrl}/domains/team/${teamId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting team domain:', error);
      throw error;
    }
  }
}