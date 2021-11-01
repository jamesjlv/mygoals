import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Flex,
  Text,
} from '@chakra-ui/react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Button } from '../Button';
import { Select } from '../Form/Select';
import { Input } from '../Form/Input';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import React, { EventHandler, useContext, useEffect, useState } from 'react';
import { GoalsContext } from '../../contexts/GoalsContext';
import { api } from '../../services/api';

interface FormGoalProps {
  isOpen: boolean;
  handleClose: () => void;
  initialData?: {
    description: string;
    category: string;
    days: string;
  };
}

type CreateGoalData = {
  ref?: string;
  description: string;
  category: string;
  quantity: string;
  type: string;
};

type SelectedGoalData = {
  ref: string;
  category_description: string;
  days: number;
  daysCompleted: number;
  description: string;
  end_date: string;
  start_date: string;
  report_type: string;
  category: string;
  reports: [];
};

const createGoalSchema = yup.object().shape({
  ref: yup.string(),
  description: yup.string().required('Descrição obrigatória'),
  category: yup.string().required('Informe uma categoria'),
  quantity: yup.number().required('Informe os dias').typeError('Apenas numeros'),
  type: yup.string().required('Informe como o sistema deve concluir sua meta'),
});

export function FormGoal({ isOpen, handleClose, initialData }: FormGoalProps) {
  const { selectedGoal, reloadGoalsData, handleGoalsData } = useContext(GoalsContext);
  const [stateForm, setStateForm] = useState(false);
  const [formGoal, setFormGoal] = useState<SelectedGoalData>({} as SelectedGoalData);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    reset,
  } = useForm({
    resolver: yupResolver(createGoalSchema),
  });

  const handleCreateGoal: SubmitHandler<CreateGoalData> = async (values) => {
    setStateForm(true);
    return new Promise<void>(async (resolve) => {
      resolve();
      if (values.ref) {
        await api.put('/api/goal', values);
      } else {
        await api.post('/api/goal', values);
      }
      handleClose();
      reset();
      setStateForm(false);
      reloadGoalsData(selectedGoal.ref);
    });
  };

  function handleResetForm() {
    reloadGoalsData(selectedGoal.ref);
    handleClose();
    reset();
  }

  useEffect(() => {
    setFormGoal(selectedGoal);
  }, [selectedGoal]);

  return (
    <Modal isOpen={isOpen} onClose={handleResetForm}>
      <ModalOverlay />
      <ModalContent bg="gray.800" width={['90%', '100%']}>
        <ModalHeader
          fontWeight="bold"
          align="center"
          color="pink.500"
          fontSize={['1.2rem', '1.5rem']}
        >
          {selectedGoal?.description ? 'Editar meta' : 'Cadastrar nova meta'}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex
            as="form"
            flexDirection="column"
            marginBottom="1rem"
            onSubmit={handleSubmit(handleCreateGoal)}
          >
            {selectedGoal?.ref !== undefined && (
              <Flex visibility="hidden" margin="0" padding="0">
                <Input
                  name="ref"
                  type="hidden"
                  value={formGoal?.ref}
                  register={register}
                  error={errors.ref}
                />
                <Input
                  name="start_date"
                  type="hidden"
                  value={formGoal?.start_date}
                  register={register}
                  error={errors.start_date}
                />
              </Flex>
            )}
            <Input
              name="description"
              label="Nome da meta"
              placeholder="Estudar matemática..."
              value={formGoal?.description}
              register={register}
              error={errors.description}
            />
            <Input
              name="category"
              label="Categoria"
              placeholder="Esportes, saúde, estudos..."
              value={formGoal?.category_description}
              register={register}
              error={errors.category}
            />
            <Text marginTop="1rem" fontWeight="500" color="gray.500" fontSize={['.8rem', '1rem']}>
              Quantos dias para atingir a meta?
            </Text>
            <Flex flexDirection="row" width="30%">
              <Input
                name="quantity"
                value={formGoal?.days}
                placeholder="Ex: 99"
                register={register}
                error={errors.quantity}
                type="number"
                marginBottom={!selectedGoal?.ref ? '0rem' : '2rem' || 0}
              />
            </Flex>
            {!selectedGoal?.ref && (
              <Select
                name="type"
                label="Como devo marcar que a meta foi concluida diariamente?"
                register={register}
                error={errors.type}
                marginBottom="2rem"
              >
                <option value="auto_report">Automaticamente</option>
                <option value="need_report">Manualmente</option>
              </Select>
            )}

            <Button
              description="Salvar"
              color="pink.600"
              width="100%"
              type="submit"
              isLoading={stateForm}
            />
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
