import { Flex, useDisclosure } from '@chakra-ui/react';
import { getSession, useSession } from 'next-auth/client';
import { useEffect, useState } from 'react';
import { SideBar } from '../components/SideBar';
import { SyncUserGoals } from '../services/SyncUserGoals';
import { DashBoard } from '../components/DashBoard';
import { GetServerSideProps } from 'next';
import { FormGoal } from '../components/FormGoal';

type GoalsData = {
  description: string;
  ref: string;
  goals: {
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
  }[];
}[];

interface SyncUserGoalsProps {
  id?: string;
  user?: {
    email?: string;
    name?: string;
    image?: string;
  };
}
interface DashboardProps {
  goals_data: GoalsData;
}

export default function Dashboard({ goals_data }: DashboardProps) {
  const [goals, setGoals] = useState<GoalsData>(goals_data);
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [session, loading] = useSession();
  async function handleClose(): Promise<void> {
    onClose();
    return;
  }

  async function handleSyncGoals() {
    const goalsSync = await SyncUserGoals(session);
    setGoals(goalsSync);
    return;
  }

  useEffect(() => {
    handleSyncGoals();
  }, [isOpen]);

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
      session: session,
    },
  };
};
