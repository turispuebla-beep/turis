// ... (mantener las importaciones existentes)
import MediaGallery from '../components/Media/MediaGallery';

// ... (mantener el resto del código hasta el getDialogContent)

                {activeTab === 5 && (
                    <MediaGallery
                        media={selectedTeam.media}
                        teamId={selectedTeam.id}
                        permissions={permissions}
                        onAddMedia={(media) => console.log('Añadir medio:', media)}
                        onDeleteMedia={(id) => console.log('Eliminar medio:', id)}
                    />
                )}

// ... (mantener el resto del código igual)