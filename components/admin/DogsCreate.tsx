'use client'

import React, { useState } from 'react'
import type { CreateViewComponent } from '@payloadcms/next/views'
import { useRouter } from 'next/navigation'

/**
 * Custom Create View para perros
 * Formulario para crear nuevos perros con:
 * - Validaciones
 * - Tabs para organizar campos
 * - Previsualización antes de enviar
 * - Manejo de errores
 */
export const DogsCreate: CreateViewComponent = ({ collection }) => {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('info')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [showPreview, setShowPreview] = useState(false)

  // Estado del formulario
  const [formData, setFormData] = useState({
    name: '',
    chipNumber: '',
    sex: '',
    breed: '',
    birthDate: '',
    entryDate: new Date().toISOString().split('T')[0],
    neuteringDate: '',
    origin: '',
    status: 'available',
    webDescription: '',
    testedWithCats: false,
    isInvisible: false,
    notes: '',
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as any
    const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value

    setFormData(prev => ({
      ...prev,
      [name]: newValue,
    }))
  }

  const validateForm = () => {
    const errors = []

    if (!formData.name.trim()) {
      errors.push('El nombre es obligatorio')
    }

    if (!formData.entryDate) {
      errors.push('La fecha de entrada es obligatoria')
    }

    if (formData.chipNumber && formData.chipNumber.trim().length < 3) {
      errors.push('El chip debe tener al menos 3 caracteres')
    }

    return errors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const errors = validateForm()
    if (errors.length > 0) {
      setErrorMessage(errors.join(', '))
      setSubmitStatus('error')
      return
    }

    setIsSubmitting(true)
    setSubmitStatus('idle')
    setErrorMessage('')

    try {
      const response = await fetch('/api/dogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Error al crear el perro')
      }

      const data = await response.json()
      setSubmitStatus('success')

      setTimeout(() => {
        router.push(`/admin/collections/dogs/${data.doc.id}`)
      }, 1500)
    } catch (error: any) {
      setSubmitStatus('error')
      setErrorMessage(error.message || 'Error al guardar')
      console.error('Error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="dogs-create-wrapper">
      <style>{`
        .dogs-create-wrapper {
          padding: 20px;
          max-width: 1200px;
          margin: 0 auto;
          background: #fff;
        }

        .create-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          border-bottom: 2px solid #f0f0f0;
          padding-bottom: 20px;
        }

        .create-title {
          font-size: 28px;
          font-weight: 700;
          color: #333;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .tabs-container {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
          border-bottom: 2px solid #e0e0e0;
          flex-wrap: wrap;
        }

        .tab-button {
          padding: 12px 20px;
          border: none;
          background: transparent;
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
          color: #666;
          border-bottom: 3px solid transparent;
          transition: all 0.2s;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .tab-button.active {
          color: #2563eb;
          border-bottom-color: #2563eb;
        }

        .tab-button:hover:not(.active) {
          color: #333;
        }

        .tab-content {
          background: #fafafa;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 20px;
          min-height: 300px;
        }

        .form-section {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-bottom: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .form-group label {
          font-weight: 600;
          margin-bottom: 8px;
          color: #333;
          font-size: 14px;
        }

        .form-group .required {
          color: #dc2626;
        }

        .form-group input,
        .form-group textarea,
        .form-group select {
          padding: 10px 12px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 14px;
          font-family: inherit;
          transition: all 0.2s;
        }

        .form-group input:focus,
        .form-group textarea:focus,
        .form-group select:focus {
          outline: none;
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }

        .form-group.full {
          grid-column: 1 / -1;
        }

        .form-group.checkbox {
          flex-direction: row;
          align-items: center;
          margin-bottom: 15px;
        }

        .form-group.checkbox input {
          margin-right: 8px;
          width: auto;
          cursor: pointer;
        }

        .form-group.checkbox label {
          margin: 0;
          cursor: pointer;
          display: flex;
          align-items: center;
        }

        .section-title {
          font-size: 16px;
          font-weight: 700;
          color: #333;
          margin-bottom: 15px;
          padding-bottom: 10px;
          border-bottom: 2px solid #2563eb;
        }

        .alert {
          padding: 15px;
          border-radius: 6px;
          margin-bottom: 20px;
          display: flex;
          align-items: flex-start;
          gap: 10px;
        }

        .alert.error {
          background: #fee2e2;
          border: 1px solid #fecaca;
          color: #7f1d1d;
        }

        .alert.success {
          background: #dcfce7;
          border: 1px solid #bbf7d0;
          color: #166534;
        }

        .alert.info {
          background: #e0e7ff;
          border: 1px solid #c7d2fe;
          color: #1e3a8a;
        }

        .alert-icon {
          font-size: 18px;
          flex-shrink: 0;
        }

        .alert-content {
          flex: 1;
          font-size: 14px;
        }

        .preview-section {
          background: #f3f4f6;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 20px;
          border: 2px solid #d1d5db;
        }

        .preview-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 15px;
        }

        .preview-item {
          background: white;
          padding: 12px;
          border-radius: 6px;
          border-left: 4px solid #2563eb;
        }

        .preview-label {
          font-size: 12px;
          color: #666;
          text-transform: uppercase;
          font-weight: 600;
          margin-bottom: 5px;
        }

        .preview-value {
          font-size: 14px;
          color: #333;
          font-weight: 600;
        }

        .preview-value.empty {
          color: #999;
          font-style: italic;
        }

        .action-buttons {
          display: flex;
          gap: 10px;
          justify-content: flex-end;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 2px solid #f0f0f0;
          flex-wrap: wrap;
        }

        .btn {
          padding: 10px 20px;
          border: none;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.2s;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .btn-primary {
          background: #2563eb;
          color: white;
        }

        .btn-primary:hover:not(:disabled) {
          background: #1d4ed8;
          box-shadow: 0 4px 6px rgba(37, 99, 235, 0.4);
        }

        .btn-primary:disabled {
          background: #9ca3af;
          cursor: not-allowed;
        }

        .btn-secondary {
          background: #e5e7eb;
          color: #333;
        }

        .btn-secondary:hover {
          background: #d1d5db;
        }

        .btn-outline {
          background: transparent;
          border: 2px solid #d1d5db;
          color: #333;
        }

        .btn-outline:hover {
          border-color: #2563eb;
          color: #2563eb;
        }

        .hint {
          font-size: 12px;
          color: #666;
          margin-top: 5px;
        }
      `}</style>

      {/* Header */}
      <div className="create-header">
        <div className="create-title">
          🐕 Crear nuevo perro
        </div>
      </div>

      {/* Alertas */}
      {submitStatus === 'error' && errorMessage && (
        <div className="alert error">
          <div className="alert-icon">⚠️</div>
          <div className="alert-content">{errorMessage}</div>
        </div>
      )}

      {submitStatus === 'success' && (
        <div className="alert success">
          <div className="alert-icon">✅</div>
          <div className="alert-content">¡Perro creado exitosamente! Redirigiendo...</div>
        </div>
      )}

      <div className="alert info">
        <div className="alert-icon">ℹ️</div>
        <div className="alert-content">Los campos marcados con <span className="required">*</span> son obligatorios</div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Tabs */}
        <div className="tabs-container">
          <button
            type="button"
            className={`tab-button ${activeTab === 'info' ? 'active' : ''}`}
            onClick={() => setActiveTab('info')}
          >
            📋 Información
          </button>
          <button
            type="button"
            className={`tab-button ${activeTab === 'health' ? 'active' : ''}`}
            onClick={() => setActiveTab('health')}
          >
            🏥 Salud
          </button>
          <button
            type="button"
            className={`tab-button ${activeTab === 'description' ? 'active' : ''}`}
            onClick={() => setActiveTab('description')}
          >
            📝 Descripción
          </button>
          <button
            type="button"
            className={`tab-button ${activeTab === 'extra' ? 'active' : ''}`}
            onClick={() => setActiveTab('extra')}
          >
            ⚙️ Extra
          </button>
        </div>

        {/* Tab: Información básica */}
        {activeTab === 'info' && (
          <div className="tab-content">
            <div className="section-title">Datos básicos del perro</div>
            <div className="form-section">
              <div className="form-group">
                <label>
                  Nombre <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Ej: Luna, Max, Bella"
                  required
                />
                <div className="hint">Nombre del perro para identificarlo</div>
              </div>

              <div className="form-group">
                <label>Sexo</label>
                <select
                  name="sex"
                  value={formData.sex}
                  onChange={handleInputChange}
                >
                  <option value="">— Seleccionar —</option>
                  <option value="male">Macho</option>
                  <option value="female">Hembra</option>
                </select>
              </div>

              <div className="form-group">
                <label>Raza</label>
                <input
                  type="text"
                  name="breed"
                  value={formData.breed}
                  onChange={handleInputChange}
                  placeholder="Ej: Galgo, Podenco"
                />
              </div>

              <div className="form-group">
                <label>Chip (Microchip)</label>
                <input
                  type="text"
                  name="chipNumber"
                  value={formData.chipNumber}
                  onChange={handleInputChange}
                  placeholder="Número de chip"
                />
                <div className="hint">Opcional pero importante para identificación</div>
              </div>

              <div className="form-group">
                <label>Fecha de nacimiento</label>
                <input
                  type="date"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>
                  Fecha de entrada <span className="required">*</span>
                </label>
                <input
                  type="date"
                  name="entryDate"
                  value={formData.entryDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="section-title" style={{ marginTop: '30px' }}>
              Estado y visibilidad
            </div>
            <div className="form-section">
              <div className="form-group">
                <label>Estado</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                >
                  <option value="available">Disponible</option>
                  <option value="adopted">Adoptado</option>
                  <option value="fostered">En acogida</option>
                  <option value="in_residence">En residencia</option>
                  <option value="in_treatment">En tratamiento</option>
                  <option value="reserved">Reservado</option>
                  <option value="lost">Perdido</option>
                  <option value="deceased">Fallecido</option>
                </select>
              </div>
            </div>

            <div className="form-section">
              <div className="form-group checkbox">
                <input
                  type="checkbox"
                  id="isInvisible"
                  name="isInvisible"
                  checked={formData.isInvisible}
                  onChange={handleInputChange}
                />
                <label htmlFor="isInvisible">Ocultar de la web</label>
              </div>

              <div className="form-group checkbox">
                <input
                  type="checkbox"
                  id="testedWithCats"
                  name="testedWithCats"
                  checked={formData.testedWithCats}
                  onChange={handleInputChange}
                />
                <label htmlFor="testedWithCats">Testado con gatos ✓</label>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Salud */}
        {activeTab === 'health' && (
          <div className="tab-content">
            <div className="section-title">Información de salud</div>
            <div className="form-section">
              <div className="form-group">
                <label>Fecha de esterilización</label>
                <input
                  type="date"
                  name="neuteringDate"
                  value={formData.neuteringDate}
                  onChange={handleInputChange}
                />
                <div className="hint">Fecha en que fue castrado/esterilizado</div>
              </div>
            </div>

            <div className="alert info" style={{ marginTop: '20px' }}>
              <div className="alert-icon">💡</div>
              <div className="alert-content">
                Las vacunas, desparasitaciones e historial veterinario pueden añadirse después de crear el perro en la vista de edición.
              </div>
            </div>
          </div>
        )}

        {/* Tab: Descripción */}
        {activeTab === 'description' && (
          <div className="tab-content">
            <div className="section-title">Descripción para la web</div>
            <div className="form-section">
              <div className="form-group full">
                <label>Descripción para adopción</label>
                <textarea
                  name="webDescription"
                  value={formData.webDescription}
                  onChange={handleInputChange}
                  placeholder="Describe al perro: personalidad, comportamiento, características especiales, etc..."
                  style={{ minHeight: '200px' }}
                />
                <div className="hint">
                  Esta descripción aparecerá en la página web. Sé descriptivo y atractivo para posibles adoptantes.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Extra */}
        {activeTab === 'extra' && (
          <div className="tab-content">
            <div className="section-title">Información adicional</div>

            <div className="form-section">
              <div className="form-group full">
                <label>Origen del perro</label>
                <textarea
                  name="origin"
                  value={formData.origin}
                  onChange={handleInputChange}
                  placeholder="¿De dónde procede? ¿Cuál es su historia?"
                  style={{ minHeight: '120px' }}
                />
                <div className="hint">Información sobre cómo llegó a la organización</div>
              </div>
            </div>

            <div className="section-title" style={{ marginTop: '30px' }}>
              Notas internas
            </div>
            <div className="form-section">
              <div className="form-group full">
                <label>Notas</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Notas internas para el equipo (no se mostrarán en la web)"
                  style={{ minHeight: '120px' }}
                />
                <div className="hint">Solo visible para el equipo interno</div>
              </div>
            </div>
          </div>
        )}

        {/* Botones de acción */}
        <div className="action-buttons">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => router.back()}
            disabled={isSubmitting}
          >
            ← Cancelar
          </button>

          <button
            type="button"
            className="btn btn-outline"
            onClick={() => setShowPreview(!showPreview)}
            disabled={isSubmitting}
          >
            {showPreview ? '← Editar' : '👁️ Vista previa'}
          </button>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting || !formData.name || !formData.entryDate}
          >
            {isSubmitting ? '⏳ Creando...' : '✨ Crear perro'}
          </button>
        </div>
      </form>

      {/* Vista previa */}
      {showPreview && (
        <div className="preview-section">
          <div className="section-title">👁️ Vista previa del registro</div>
          <div className="preview-grid">
            <div className="preview-item">
              <div className="preview-label">Nombre</div>
              <div className={`preview-value ${!formData.name ? 'empty' : ''}`}>
                {formData.name || '—'}
              </div>
            </div>

            <div className="preview-item">
              <div className="preview-label">Raza</div>
              <div className={`preview-value ${!formData.breed ? 'empty' : ''}`}>
                {formData.breed || '—'}
              </div>
            </div>

            <div className="preview-item">
              <div className="preview-label">Sexo</div>
              <div className={`preview-value ${!formData.sex ? 'empty' : ''}`}>
                {formData.sex
                  ? formData.sex === 'male'
                    ? 'Macho'
                    : 'Hembra'
                  : '—'}
              </div>
            </div>

            <div className="preview-item">
              <div className="preview-label">Fecha de entrada</div>
              <div className="preview-value">
                {formData.entryDate
                  ? new Date(formData.entryDate).toLocaleDateString('es-ES')
                  : '—'}
              </div>
            </div>

            <div className="preview-item">
              <div className="preview-label">Estado</div>
              <div className="preview-value">{formData.status}</div>
            </div>

            <div className="preview-item">
              <div className="preview-label">Chip</div>
              <div className={`preview-value ${!formData.chipNumber ? 'empty' : ''}`}>
                {formData.chipNumber || '—'}
              </div>
            </div>

            {formData.webDescription && (
              <div className="preview-item" style={{ gridColumn: '1 / -1' }}>
                <div className="preview-label">Descripción</div>
                <div className="preview-value" style={{ whiteSpace: 'pre-wrap' }}>
                  {formData.webDescription.substring(0, 200)}
                  {formData.webDescription.length > 200 ? '...' : ''}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default DogsCreate
