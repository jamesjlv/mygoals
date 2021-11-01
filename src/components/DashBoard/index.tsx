import { Flex, Text, Grid, Image, ScaleFade } from '@chakra-ui/react';
import { theme } from '../../styles/theme';
import { Button } from '../Button';
import { EditIcon } from '@chakra-ui/icons';
import { useContext, useState } from 'react';
import { GoalsContext } from '../../contexts/GoalsContext';
import { RadialBar } from './RadialBar';
import { format } from 'date-fns';
import { api } from '../../services/api';
import { SyncUserGoals } from '../../services/SyncUserGoals';
import { getSession } from 'next-auth/client';
import { Options } from './Options';

interface DashboardProps {
  onOpen: () => void;
}

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

export function DashBoard({ onOpen }: DashboardProps) {
  const { selectedGoal } = useContext(GoalsContext);

  return (
    <Flex flexDirection="column" height="100%" alignItems="center" justifyContent="center">
      {selectedGoal?.days === undefined ? (
        <>
          <Image src="/select.png" alt="Selecione uma meta" width={['50%', '20%']} />
          <Text marginTop="2rem" fontSize={['1rem', '1.5rem']} fontWeight="500" color="gray.400">
            Selecione uma meta no menu
          </Text>
        </>
      ) : (
        <ScaleFade
          initialScale={0.9}
          in={selectedGoal?.days && true}
          style={{
            height: '100%',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <RadialBar />

          <Flex
            height="2.5rem"
            style={{ border: '1px solid #C4244D', borderRadius: '8px' }}
            alignItems="center"
            justifyContent="center"
            marginTop="2rem"
            width="100%"
            maxWidth={['89%', '34%']}
          >
            <Flex alignItems="center" onClick={onOpen} cursor="pointer">
              <Text>{selectedGoal?.description}</Text>
              <EditIcon marginLeft="1rem" />
            </Flex>
          </Flex>
          <Options />
        </ScaleFade>
      )}
    </Flex>
  );
}
