import React, { useCallback, useEffect, useState } from 'react'
import { useToast } from '@hooks/Toast/toast'
import { useConfirmDialog } from '@hooks/confirmDialog'
import { useOptionDialog } from '@hooks/optionDialog'
import { useModal } from '@hooks/modal'
import { useSelectDialog } from '@hooks/selectDialog'

import api from '@services/api'
import { getYear, getMonth } from 'date-fns'
import months from '@global/months'

import { Container, Title, FlexRow, SelectContainer, List, ListItem, ListItemBox, Subtitle, IconButton, ListEmpty } from '@styles/components'
import { FiMoreVertical } from 'react-icons/fi'
import Accordion from '@components/Accordion'
import Button from '@components/Button'
import CreateHarvestForm from '@components/Forms/CreateHarvestForm'
import EditHarvestForm from '@components/Forms/EditHarvestForm'
import HarvestView from '@components/Containers/ModalViews/HarvestView'

const HarvestList = () => {
  const { addToast } = useToast()
  const { openConfirmDialog } = useConfirmDialog()
  const { openOptionDialog } = useOptionDialog()
  const { openModal, closeAllModals } = useModal()
  const { openSelectDialog } = useSelectDialog()

  const today = new Date()

  const [mappedHarvest, setMappedHarvests] = useState([])
  const [ruralProperties, setRuralProperties] = useState([])
  const [fields, setFields] = useState([])
  const [years, setYears] = useState([])
  const [selectedRuralProperty, setSelectedRuralProperty] = useState(null)
  const [selectedField, setSelectedField] = useState(null)
  const [selectedYear, setSelectedYear] = useState(() => getYear(today))
  const [selectedMonth, setSelectedMonth] = useState(() => getMonth(today))

  const loadRuralProperties = async () => {
    const res = await api.get('rural-properties')

    setRuralProperties(res.data)
  }

  useEffect(() => {
    loadRuralProperties()
  }, [])

  const loadFields = useCallback(async () => {
    if (selectedRuralProperty) {
      const res = await api.get(`rural-properties/${selectedRuralProperty.id}/fields`)
      setFields(res.data)
    }
  }, [selectedRuralProperty])

  useEffect(() => {
    loadFields()
  }, [selectedRuralProperty, loadFields])

  const loadYears = useCallback(async () => {
    if (selectedField) {
      const res = await api.get(`harvests/years?field_id=${selectedField.id}`)
      setYears(res.data)
    }
  }, [selectedField])

  useEffect(() => {
    loadYears()
  }, [selectedField, loadYears])

  const loadHarvests = useCallback(async () => {
    if (selectedField) {
      const res = await api.get(`harvests/query?field_id=${selectedField.id}&year=${selectedYear}&month=${selectedMonth + 1}`)
      setMappedHarvests(res.data)
    }
  }, [selectedField, selectedYear, selectedMonth])

  useEffect(() => {
    loadHarvests()
  }, [selectedField, selectedYear, selectedMonth, loadHarvests])

  const openSelectRuralProperty = () => {
    openSelectDialog({
      title: 'Selecione uma propriedade rural',
      options: ruralProperties.map(ruralProperty => ({ value: ruralProperty.id, label: ruralProperty.name }))
    }).then(value => {
      setSelectedRuralProperty(ruralProperties.find(ruralProperty => ruralProperty.id === value))
    })
  }

  const openSelectField = () => {
    if (!selectedRuralProperty) {
      addToast({ title: 'Erro', description: 'Selecione uma propriedade rural!', type: 'error' })
      return;
    } 

    openSelectDialog({
      title: 'Selecione um talhão',
      options: fields.map(field => ({ value: field.id, label: field.name }))
    }).then(value => {
      setSelectedField(fields.find(field => field.id === value))
    })
  }

  const openSelectYear = () => {
    openSelectDialog({
      title: 'Selecione um ano',
      options: years.map(year => ({ value: year, label: year }))
    }).then(value => {
      setSelectedYear(value)
    })
  }

  const openSelectMonth = () => [
    openSelectDialog({
      title: 'Selecione um mês',
      options: months.map((month, index) => ({ value: index, label: month }))
    }).then(value => {
      setSelectedMonth(value)
    })
  ]

  const openModalCreateHarvest = () => {
    if (!selectedField) {
      addToast({ title: 'Erro', description: 'Selecione um talhão!', type: 'error' })
      return;
    } 

    openModal({
      id: 'createHarvest',
      title: 'Nova Colheita',
      content: (
        <CreateHarvestForm
          ruralProperty={{ name: selectedRuralProperty?.name }}
          field={{ id: selectedField?.id, name: selectedField?.name }}
          cultivation={{ fullname: selectedField?.cultivation.fullname }}
          onCreated={handleHarvestCreated}
          onCancel={closeAllModals}
        />
      )
    })
  }

  const openModalViewHarvest = (id) => {
    openModal({
      id: 'viewHarvest',
      title: 'Colheita',
      content: (
        <HarvestView
          entityId={id}
          onClose={closeAllModals}
          onEditClick={() => openModalEditHarvest(id)}
          onRemoveClick={() => handleRemoveHarvest(id)}
        />
      )
    })
  }

  const openModalEditHarvest = (id) => {
    openModal({
      id: 'editHarvest',
      title: 'Editar Colheita',
      content: (
        <EditHarvestForm
          entityId={id}
          onEdited={handleHarvestEdited}
          onCancel={closeAllModals}
        />
      )
    })
  }

  const handleRemoveHarvest = (id) => {
    openConfirmDialog({
      title: 'Confirmação de Remoção',
      message: 'Realmente tem certeza de realizar essa operação de remoção?'
    }).then(async res => {
      if (res) {
        await api.delete(`harvests/${id}`)

        closeAllModals()
        addToast({ title: 'Sucesso', description: 'Remoção realizada com sucesso!' })
        loadHarvests()
      }
    })
  }

  const handleHarvestCreated = () => {
    closeAllModals()
    addToast({ title: 'Sucesso', description: 'Colheita criada com sucesso!' })
    loadHarvests()
  }

  const handleHarvestEdited = () => {
    closeAllModals()
    addToast({ title: 'Sucesso', description: 'Colheita editada com sucesso!' })
    loadHarvests()
  }

  const handleOpenOptionDialog = (e, id) => {
    e.stopPropagation()

    openOptionDialog([
      { label: 'Editar', action: () => openModalEditHarvest(id) },
      { label: 'Remover', action: () => handleRemoveHarvest(id) }
    ])
  }

  return (
    <Container page>
      <FlexRow justifyContent="space-between">
        <Title>Colheitas</Title>

        <Button onClick={openModalCreateHarvest}>Criar</Button>
      </FlexRow>

      <br />

      <SelectContainer onClick={openSelectRuralProperty}>
        <p>Propriedade Rural</p>
        <p>{selectedRuralProperty?.name || 'Selecione uma propriedade rural'}</p>
      </SelectContainer>

      <br />

      <SelectContainer onClick={openSelectField}>
        <p>Talhão</p>
        <p>{selectedField?.name || 'Selecione um talhão'}</p>
      </SelectContainer>

      <br />

      <FlexRow>
        <SelectContainer onClick={openSelectYear}>
          <p>Ano</p>
          <p>{selectedYear}</p>
        </SelectContainer>

        <SelectContainer onClick={openSelectMonth}>
          <p>Mês</p>
          <p>{months[selectedMonth]}</p>
        </SelectContainer>
      </FlexRow>

      <br />

      {/* 
        index 0: date
        index 1: harvest  
      */}

      {mappedHarvest.length ? mappedHarvest.map((item, index) => (
        <Accordion
          key={index}
          title={item[0]}
          content={(
            <List>
              {
                item[1].map((item, index) => (
                  <ListItem
                    hoverable
                    key={index}
                    onClick={() => openModalViewHarvest(item.id)}
                  >
                    <ListItemBox grow={1}>
                      <Subtitle>{item.classification.name}</Subtitle>
                      <p>Quantidade: {item.quantity} {item.unitMeasure.abbreviation}</p>
                    </ListItemBox>

                    <ListItemBox>
                      <IconButton onClick={(e) => handleOpenOptionDialog(e, item.id)}>
                        <FiMoreVertical size={24} />
                      </IconButton>
                    </ListItemBox>
                  </ListItem>
                ))
              }
            </List>
          )}
        />
      )) : (
        <ListEmpty>
          <i>Não há colheitas cadastradas.</i>
        </ListEmpty>
      )}
    </Container>
  )
}

export default HarvestList