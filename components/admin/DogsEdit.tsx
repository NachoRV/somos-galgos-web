'use client'

import React from 'react'
import type { EditViewComponent } from '@payloadcms/next/views'

/**
 * Vista de edición personalizada para perros
 * Placeholder simple - Payload maneja la lógica real
 */
export const DogsEdit: EditViewComponent = ({ 
  collection, 
  data, 
  isLoading 
}) => {
  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>
        🐕 Editar: {data?.name || 'Perro'}
      </h1>
      <p style={{ color: '#666' }}>
        Vista personalizada en desarrollo. Por ahora usa la vista default de Payload.
      </p>
      <div style={{ 
        marginTop: '20px',
        padding: '15px',
        background: '#f0f0f0',
        borderRadius: '8px'
      }}>
        <strong>Datos del perro:</strong>
        <pre style={{ marginTop: '10px', fontSize: '12px' }}>
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    </div>
  )
}

export default DogsEdit
