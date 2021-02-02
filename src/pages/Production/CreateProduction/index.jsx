import React, { useEffect, useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { useToast } from '@hooks/Toast/toast'

import api from '@services/api'

import { Container } from '@styles/components'
import Modal from '@components/Modal'
import CreateProductionForm from '@components/Forms/CreateProductionForm'

const CreateProduction = () => {
  const history = useHistory()
  const { addToast } = useToast()

  const search = useLocation().search
  const fieldId = new URLSearchParams(search).get('talhao')

  const [field, setField] = useState(null)

  const loadField = async () => {
    const res = await api.get(`fields/${fieldId}?_expand=ruralProperty&_expand=cultivation`)
    setField({
      ...res.data,
      cultivation: {
        id: res.data.cultivation.id,
        name: `${res.data.cultivation.name} ${res.data.cultivation.variety}`
      }
    })
  }

  useEffect(() => {
    loadField()
  }, [])

  const handleCreated = () => {
    addToast({ title: 'Sucesso', description: 'Propriedade rural criada com sucesso!' })
    history.push(`/talhoes/gerenciar/${field.id}`)
  }

  return (
    <Container>
      <Modal 
        fullPage
        show={true}
        closeModal={() => history.goBack()}
        title="Nova Produção"
        content={(
          <CreateProductionForm 
            ruralProperty={{ id: field?.ruralProperty.id, name: field?.ruralProperty.name || '' }}
            field={{ id: field?.id, name: field?.name || '' }}
            cultivation={{ id: field?.cultivation.id, name: field?.cultivation.name }}
            onCreated={handleCreated}
            onCancel={() => history.goBack()}
          />
        )}
      />
    </Container>
  )
}

export default CreateProduction