import { useContext, useState } from 'react';
import { GoalsContext } from '../../../contexts/GoalsContext';
import { Text, Grid, Flex } from '@chakra-ui/react';
import { theme } from '../../../styles/theme';
import { Button } from '../../Button';
import { api } from '../../../services/api';
import { format } from 'date-fns';
import { GoalsReport } from '../../../services/GoalsReport';

export function Options() {
  const { selectedGoal, reloadGoalsData } = useContext(GoalsContext);
  const [dimiss, setDimiss] = useState(false);
  const [did, setDid] = useState(false);
  const { isCompleted, alreadyReportedToday, daysCompleted } = GoalsReport();

  const handleCreateReport = async (type: string) => {
    if (type === 'dismiss') {
      setDimiss(true);
    } else {
      setDid(true);
    }
    await api.post('/api/goalReport', {
      goal_ref: selectedGoal.ref,
      reportDate: format(new Date(), 'yyyy,MM,dd'),
      type: type,
    });
    if (type === 'dimiss') {
      setDimiss(false);
    } else {
      setDid(false);
    }
    reloadGoalsData(selectedGoal.ref);
  };

  return (
    <>
      {Math.floor(
        (100 * selectedGoal?.daysCompleted - selectedGoal?.reports.length) / selectedGoal?.days
      ) === 100 || isCompleted ? (
        <Text color="pink.600" marginTop="1rem" fontWeight="600" fontSize={['.8rem', '1rem']}>
          Parabéns, você concluiu sua meta! 🎉
        </Text>
      ) : alreadyReportedToday ? (
        <Text color="gray.400" fontSize={['.8rem', '1rem']} align="center" padding="1rem">
          Ei, amanhã você poderá informar se concluiu sua meta!
        </Text>
      ) : (
        <Grid width={['89%', '34%']} marginTop={['1rem', '1rem']} gap="2">
          {selectedGoal.report_type === 'need_report' && (
            <Flex
              as="form"
              onSubmit={(e) => {
                e.preventDefault();
                handleCreateReport('did');
              }}
            >
              <Button
                description="Concluido"
                color={theme.colors.green[500]}
                width="100%"
                isLoading={did}
              />
            </Flex>
          )}
          {daysCompleted > 0 && (
            <Flex
              as="form"
              onSubmit={(e) => {
                e.preventDefault();
                handleCreateReport('dismiss');
              }}
            >
              <Button
                description="Hoje não deu..."
                color={theme.colors.gray[500]}
                width="100%"
                isLoading={dimiss}
              />
            </Flex>
          )}
        </Grid>
      )}
    </>
  );
}
