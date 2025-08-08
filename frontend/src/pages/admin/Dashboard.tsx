// ... (código anterior sin cambios hasta la línea 85)

    const handleUpdateTeam = async () => {
        if (!selectedTeam || !teamName.trim()) {
            setError('El nombre del equipo es obligatorio');
            return;
        }

        try {
            setError(null);
            setSuccess(null);
            
            // Actualizar información básica del equipo
            const updatedTeam = await teamService.updateTeam(selectedTeam.id, {
                name: teamName.trim()
            });

            // Si hay un nuevo logo, subirlo
            if (logo) {
                await teamService.updateTeamLogo(selectedTeam.id, logo);
            }

            // Actualizar el estado local
            setTeams(teams.map(team => 
                team.id === selectedTeam.id 
                    ? { ...team, name: teamName.trim() }
                    : team
            ));

            setSuccess('Equipo actualizado correctamente');
            setOpenLogoDialog(false);
            setLogo(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error actualizando el equipo');
        }
    };

    // ... (resto del código sin cambios)