import React, { useCallback, useEffect, useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { useToast } from '@hooks/Toast/toast'

import api from '@services/api'

import { Container } from '@styles/components'
import Modal from '@components/Modal'
import CreateHarvestForm from '@components/Forms/CreateHarvestForm'

const CreateHarvest = () => {
  const history = useHistory()
  const { addToast } = useToast()

  const search = useLocation().search
  const fieldId = new URLSearchParams(search).get('talhao')

  const [field, setField] = useState(null)

  const loadField = useCallback(async () => {
    const res = await api.get(`fields/${fieldId}`)
    setField(res.data)
  }, [fieldId])

  useEffect(() => {
    loadField()
  }, [loadField])

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
        title="Nova Colheita"
        content={(
          <CreateHarvestForm 
            ruralProperty={{ name: field?.ruralProperty.name }}
            field={{ id: field?.id, name: field?.name }}
            cultivation={{ id: field?.cultivation.id, fullname: field?.cultivation.fullname }}
            onCreated={handleCreated}
            onCancel={() => history.goBack()}
          />
        )}
      />
    </Container>
  )
}

export default CreateHarvest