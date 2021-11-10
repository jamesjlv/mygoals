import { Flex, useDisclosure, Img } from '@chakra-ui/react';
import { getSession, useSession } from 'next-auth/client';
import { useContext, useEffect, useState } from 'react';
import { SideBar } from '../components/SideBar';
import { SyncUserGoals } from '../services/SyncUserGoals';
import { DashBoard } from '../components/DashBoard';
import { GetServerSideProps } from 'next';
import { FormGoal } from '../components/FormGoal';
import { useBreakpointValue } from '@chakra-ui/react';
import { Slide } from '@chakra-ui/transition';
import { HamburgerIcon } from '@chakra-ui/icons';
import { Button } from '../components/Button';
import { GoalsContext } from '../contexts/GoalsContext';

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
  const { goals, setGoals } = useContext(GoalsContext);

  const { isOpen, onClose, onOpen } = useDisclosure();
  const [session, loading] = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const isMobile = useBreakpointValue({ base: true, md: true, lg: true, xl: false });

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  return (
    <Flex flexDirection="row" w="100vw" h="100vh">
      {goals[0] ? (
        <>
          {isMobile ? (
            <>
              <HamburgerIcon
                marginTop="1rem"
                marginLeft="1rem"
                position="absolute"
                fontSize="1.5rem"
                onClick={() => setIsMenuOpen(true)}
                zIndex="1"
              />
              <Slide direction="left" in={isMenuOpen} style={{ zIndex: 10, height: '100%' }}>
                <SideBar goals={goals} onOpen={onOpen} closeMobile={setIsMenuOpen} />
              </Slide>
            </>
          ) : (
            <>
              <SideBar goals={goals} onOpen={onOpen} />
            </>
          )}

          <Flex flexDirection="column" width="100%">
            <DashBoard onOpen={onOpen} />
            <FormGoal isOpen={isOpen} handleClose={handleClose} />
          </Flex>
        </>
      ) : (
        <>
          {isMobile ? (
            <>
              <HamburgerIcon
                marginTop="1rem"
                marginLeft="1rem"
                position="absolute"
                fontSize="1.5rem"
                onClick={() => setIsMenuOpen(false)}
                zIndex="1"
              />
              <Slide
                direction="left"
                in={isMenuOpen}
                style={{ zIndex: 10, height: '100%', width: '100%' }}
              >
                <SideBar goals={goals} onOpen={onOpen} closeMobile={setIsMenuOpen} />
              </Slide>
            </>
          ) : (
            <>
              <SideBar goals={goals} onOpen={onOpen} />
            </>
          )}
          <Flex flexDirection="column" width="100%" align="center" height="100%" justify="center">
            <Img src="/empty.png" />
            <Flex width="30%" onClick={() => onOpen()} marginTop="1.5rem">
              <Button
                description="Crie uma nova meta"
                color="pink.500"
                width="100%"
                _hover={{ backgroundColor: 'pink.500' }}
              />
            </Flex>
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
