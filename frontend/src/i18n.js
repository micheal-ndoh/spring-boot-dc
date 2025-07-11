import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
    en: {
        translation: {
            'ticket.created': 'Ticket created successfully',
            'ticket.updated': 'Ticket updated successfully',
            'ticket.deleted': 'Ticket deleted successfully',
            'ticket.error': 'Error processing ticket request',
            'label.passenger.name': 'Passenger Name',
            'label.address': 'Address',
            'label.destination.address': 'Destination Address',
            'label.kickoff.address': 'Kickoff Address',
            'label.flight.date': 'Flight Date',
            'validation.passenger.name.required': 'Passenger name is required',
            'validation.address.required': 'Address is required',
            'validation.destination.required': 'Destination address is required',
            'validation.kickoff.required': 'Kickoff address is required',
            'validation.flight.date.required': 'Flight date is required',
            'validation.flight.date.future': 'Flight date must be in the future',
            'search.title': 'Search Tickets',
            'search.button': 'Search',
            'create.title': 'Create New Ticket',
            'create.button': 'Create Ticket',
            'tickets.title': 'All Tickets',
            'loading': 'Loading...',
            'edit': 'Edit',
            'delete': 'Delete',
            'edit.title': 'Edit Ticket',
            'update': 'Update',
            'cancel': 'Cancel',
            'delete.confirm.title': 'Confirm Delete',
            'delete.confirm.message': 'Are you sure you want to delete this ticket?',
            'delete.confirm.yes': 'Yes, Delete',
            'delete.confirm.no': 'Cancel'
        }
    },
    fr: {
        translation: {
            'ticket.created': 'Billet créé avec succès',
            'ticket.updated': 'Billet mis à jour avec succès',
            'ticket.deleted': 'Billet supprimé avec succès',
            'ticket.error': 'Erreur lors du traitement de la demande de billet',
            'label.passenger.name': 'Nom du Passager',
            'label.address': 'Adresse',
            'label.destination.address': 'Adresse de Destination',
            'label.kickoff.address': 'Adresse de Départ',
            'label.flight.date': 'Date de Vol',
            'validation.passenger.name.required': 'Le nom du passager est requis',
            'validation.address.required': 'L\'adresse est requise',
            'validation.destination.required': 'L\'adresse de destination est requise',
            'validation.kickoff.required': 'L\'adresse de départ est requise',
            'validation.flight.date.required': 'La date de vol est requise',
            'validation.flight.date.future': 'La date de vol doit être dans le futur',
            'search.title': 'Rechercher des Billets',
            'search.button': 'Rechercher',
            'create.title': 'Créer un Nouveau Billet',
            'create.button': 'Créer un Billet',
            'tickets.title': 'Tous les Billets',
            'loading': 'Chargement...',
            'edit': 'Modifier',
            'delete': 'Supprimer',
            'edit.title': 'Modifier le Billet',
            'update': 'Mettre à Jour',
            'cancel': 'Annuler',
            'delete.confirm.title': 'Confirmer la Suppression',
            'delete.confirm.message': 'Êtes-vous sûr de vouloir supprimer ce billet ?',
            'delete.confirm.yes': 'Oui, Supprimer',
            'delete.confirm.no': 'Annuler'
        }
    },
    es: {
        translation: {
            'ticket.created': 'Boleto creado exitosamente',
            'ticket.updated': 'Boleto actualizado exitosamente',
            'ticket.deleted': 'Boleto eliminado exitosamente',
            'ticket.error': 'Error procesando la solicitud de boleto',
            'label.passenger.name': 'Nombre del Pasajero',
            'label.address': 'Dirección',
            'label.destination.address': 'Dirección de Destino',
            'label.kickoff.address': 'Dirección de Salida',
            'label.flight.date': 'Fecha de Vuelo',
            'validation.passenger.name.required': 'El nombre del pasajero es requerido',
            'validation.address.required': 'La dirección es requerida',
            'validation.destination.required': 'La dirección de destino es requerida',
            'validation.kickoff.required': 'La dirección de salida es requerida',
            'validation.flight.date.required': 'La fecha de vuelo es requerida',
            'validation.flight.date.future': 'La fecha de vuelo debe ser en el futuro',
            'search.title': 'Buscar Boletos',
            'search.button': 'Buscar',
            'create.title': 'Crear Nuevo Boleto',
            'create.button': 'Crear Boleto',
            'tickets.title': 'Todos los Boletos',
            'loading': 'Cargando...',
            'edit': 'Editar',
            'delete': 'Eliminar',
            'edit.title': 'Editar Boleto',
            'update': 'Actualizar',
            'cancel': 'Cancelar',
            'delete.confirm.title': 'Confirmar Eliminación',
            'delete.confirm.message': '¿Estás seguro de que quieres eliminar este boleto?',
            'delete.confirm.yes': 'Sí, Eliminar',
            'delete.confirm.no': 'Cancelar'
        }
    }
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: 'en', // default language
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false
        }
    });

export default i18n; 