import {
  Flex,
  Text,
  Stack,
  Button as ChakraButton,
  Img,
  Avatar,
  useBreakpointValue,
} from '@chakra-ui/react';
import { Search } from '../Search';
import { GroupGoals } from './GroupGoals';
import { PlusSquareIcon, CloseIcon } from '@chakra-ui/icons';
import { useContext, useState } from 'react';
import { GoalsContext } from '../../contexts/GoalsContext';
import { Button } from '../Button';
import { signOut, useSession } from 'next-auth/client';

type GoalsData = {
  description?: string;
  goals?: {
    ref: string;
    category_description: string;
    daysCompleted: number;
    days: number;
    description: string;
    end_date: string;
    start_date: string;
    report_type: string;
    category: string;
    reports: [];
  }[];
}[];

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

interface SideBarProps {
  goals: GoalsData;
  setSelectedGoal?: () => {};
  onOpen: () => void;
  closeMobile?: (boolean) => void;
}

export function SideBar({ goals, onOpen, closeMobile }: SideBarProps) {
  const { handleGoalsData } = useContext(GoalsContext);
  const [filter, setFilter] = useState('');
  const [session, loading] = useSession();
  const isMobile = useBreakpointValue({ base: true, md: true, lg: true, xl: false });

  function handleCreateForm() {
    handleGoalsData({} as SelectedGoalData);
    onOpen();
  }

  return (
    <Flex
      background="gray.800"
      w={['100%', '100%', '40%']}
      height={['100%', '100%']}
      flexDirection="column"
      overflow="auto"
      css={{
        '&::-webkit-scrollbar': {
          width: '0px',
          background: 'transparent',
        },
      }}
    >
      <Flex
        flexDirection="row"
        align="center"
        justifyContent="space-between"
        margin="2rem 2.5rem 0"
      >
        <PlusSquareIcon onClick={handleCreateForm} cursor="pointer" _focus={{ outline: 'none' }} />
        {isMobile && (
          <CloseIcon
            onClick={() => closeMobile(false)}
            cursor="pointer"
            fontSize=".7rem"
            _focus={{ outline: 'none' }}
          />
        )}
      </Flex>
      <Search filter={setFilter} />
      <Stack alignItems="center" spacing="1rem">
        {goals[0] &&
          goals?.map((goal) => (
            <GroupGoals
              key={Math.random()}
              description={goal.description}
              goals={goal.goals}
              filter={filter}
              closeMobile={closeMobile}
            />
          ))}
        {!goals[0] && (
          <>
            <Img src="/empty.png" marginTop="50%" />
            <Flex width="80%" onClick={handleCreateForm}>
              <Button
                description="Crie uma nova meta"
                color="pink.500"
                width="100%"
                _hover={{ backgroundColor: 'pink.500' }}
              />
            </Flex>
          </>
        )}
      </Stack>
      <Flex
        marginTop="2rem"
        marginBottom="2rem"
        width="80%"
        flexDirection="row"
        align="flex-end"
        padding="2rem 0"
        margin="0 auto"
        height="100%"
      >
        <Flex width="100%" align="center">
          <Avatar name={session.user.name} src={session.user.image} />
          <Flex flexDirection="column">
            <Text marginLeft="1rem" color="gray.200" fontSize={['0.8rem', '.8rem']}>
              {session.user.name}
            </Text>
            <Text marginLeft="1rem" color="gray.200" fontSize={['0.8rem', '.8rem']}>
              {session.user.email}
            </Text>
          </Flex>
        </Flex>
        <ChakraButton
          bg="gray.800"
          fontSize={['.8rem', '.9rem']}
          onClick={() => signOut()}
          _hover={{ backgroundColor: 'gray.700' }}
          _active={{ backgroundColor: 'none' }}
        >
          Sair
        </ChakraButton>
      </Flex>
    </Flex>
  );
}
