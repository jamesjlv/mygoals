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
import { Input } from '../Form/Input';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useContext, useEffect, useState } from 'react';
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
});

export function FormGoal({ isOpen, handleClose, initialData }: FormGoalProps) {
  const { selectedGoal, handleGoalsData } = useContext(GoalsContext);
  const [stateForm, setStateForm] = useState(false);
  const [formGoal, setFormGoal] = useState({} as SelectedGoalData);

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
      handleGoalsData({} as SelectedGoalData);
    });
  };

  function handleResetForm() {
    handleGoalsData({} as SelectedGoalData);
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
              <>
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
              </>
            )}
            <Input
              name="description"
              label="Nome da meta"
              placeholder="Estudar matemática..."
              value={formGoal?.description}
              register={register}
              error={errors.description}
              onChange={(e) =>
                setFormGoal((prevState) => {
                  return { ...prevState, description: e.target.value };
                })
              }
            />
            <Input
              name="category"
              label="Categoria"
              placeholder="Esportes, saúde, estudos..."
              value={formGoal?.category_description}
              register={register}
              error={errors.category}
              onChange={(e) =>
                setFormGoal((prevState) => {
                  return { ...prevState, category_description: e.target.value };
                })
              }
            />
            <Text marginTop="1rem" fontWeight="500" color="gray.500" fontSize={['.8rem', '1rem']}>
              Em quantos dias você deseja concluir a meta?
            </Text>
            <Flex flexDirection="row" width="30%" marginBottom="2rem">
              <Input
                name="quantity"
                value={formGoal?.days}
                placeholder="Ex: 99"
                register={register}
                error={errors.quantity}
                onChange={(e) =>
                  setFormGoal((prevState) => {
                    return { ...prevState, days: Number(e.target.value) };
                  })
                }
                type="number"
              />
            </Flex>
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
