import React, { useState, useEffect } from 'react';
import { SuperAdminService } from '../../services/SuperAdminService';
import { TeamDomain } from '../../services/DomainManager';
import { config } from '../../config';

const superAdminService = new SuperAdminService();

export const DomainManagement: React.FC = () => {
  const [teams, setTeams] = useState<TeamDomain[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTeams();
  }, []);

  const loadTeams = async () => {
    try {
      setLoading(true);
      const teamsList = await superAdminService.getAllTeams();
      setTeams(teamsList);
      setError(null);
    } catch (err) {
      setError('Error al cargar los equipos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivateTeam = async (teamId: string) => {
    try {
      await superAdminService.deactivateTeam(teamId);
      await loadTeams();
    } catch (err) {
      setError('Error al desactivar el equipo');
      console.error(err);
    }
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="domain-management">
      <h2>Gestión de Dominios</h2>
      <div className="teams-list">
        {teams.map(team => (
          <div key={team.teamId} className="team-card">
            <h3>{team.name}</h3>
            <div className="domain-info">
              <p>Dominio: <a href={`https://${team.subdomain}.${config.mainDomain}`} target="_blank" rel="noopener noreferrer">
                {team.subdomain}.{config.mainDomain}
              </a></p>
              <p>Admin: {team.adminEmail}</p>
              <p>Estado: {team.isActive ? 'Activo' : 'Inactivo'}</p>
              <p>Creado: {new Date(team.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="actions">
              {team.isActive && (
                <button 
                  onClick={() => handleDeactivateTeam(team.teamId)}
                  className="danger"
                >
                  Desactivar Dominio
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};