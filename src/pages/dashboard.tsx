import { Flex, Spinner, useDisclosure } from '@chakra-ui/react';
import { getSession } from 'next-auth/client';
import { useContext, useState } from 'react';
import { SideBar } from '../components/SideBar';
import { SyncUserGoals } from '../services/SyncUserGoals';
import { DashBoard } from '../components/DashBoard';
import { GetServerSideProps } from 'next';
import { FormGoal } from '../components/FormGoal';
import { GoalsContext } from '../contexts/GoalsContext';

type GoalsData = {
  description: string;
  goals: {
    category_description: string;
    days: number;
    daysCompleted: number;
    description: string;
    end_date: string;
    start_date: string;
    report_type: string;
    category: string;
    reports: [];
  }[];
}[];

interface DashboardProps {
  goals_data: GoalsData;
}

export default function Dashboard({ goals_data }: DashboardProps) {
  const [goals, setGoals] = useState<GoalsData>(goals_data);
  const { isOpen, onClose, onOpen } = useDisclosure();

  function handleClose(): void {
    onClose();
    return;
  }

  return (
    <Flex flexDirection="row" w="100vw" h="100vh">
      {goals[0] && (
        <>
          <SideBar goals={goals} onOpen={onOpen} />
          <Flex flexDirection="column" width="100%">
            <DashBoard onOpen={onOpen} />
            <FormGoal isOpen={isOpen} handleClose={handleClose} />
          </Flex>
        </>
      )}
    </Flex>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getSession({ req });
  const data = await SyncUserGoals(session);

  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: {
      goals_data: data,
    },
  };
};
