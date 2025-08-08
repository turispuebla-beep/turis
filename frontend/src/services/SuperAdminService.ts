import axios from 'axios';
import { config } from '../config';
import { DomainManager, TeamDomain } from './DomainManager';
import { NotificationService } from './NotificationService';

export interface TeamCreationData {
  name: string;
  adminEmail: string;
  adminPassword: string;
  category: string;
  location: string;
  contactPhone: string;
}

export class SuperAdminService {
  private baseUrl = config.apiUrl;
  private domainManager = new DomainManager();
  private notificationService = new NotificationService();

  async createTeam(teamData: TeamCreationData): Promise<TeamDomain> {
    try {
      // 1. Crear el equipo
      const response = await axios.post(`${this.baseUrl}/teams/create`, teamData);
      const team = response.data;

      // 2. Generar y configurar subdominio
      const teamDomain: TeamDomain = {
        teamId: team.id,
        name: team.name,
        subdomain: this.domainManager.generateSubdomain(team.name),
        adminEmail: teamData.adminEmail,
        isActive: true,
        createdAt: new Date()
      };

      await this.domainManager.createTeamSubdomain(teamDomain);

      // 3. Enviar credenciales al admin del equipo
      await this.notificationService.sendAdminCredentials({
        email: teamData.adminEmail,
        accessCode: team.accessCode,
        domain: `${teamDomain.subdomain}.turisteam.com`,
        password: teamData.adminPassword
      });

      return teamDomain;
    } catch (error) {
      console.error('Error creating team:', error);
      throw error;
    }
  }

  async getAllTeams(): Promise<TeamDomain[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/teams`);
      return response.data;
    } catch (error) {
      console.error('Error getting teams:', error);
      throw error;
    }
  }

  async deactivateTeam(teamId: string): Promise<void> {
    try {
      await axios.post(`${this.baseUrl}/teams/${teamId}/deactivate`);
    } catch (error) {
      console.error('Error deactivating team:', error);
      throw error;
    }
  }
}