import { format } from 'date-fns';
import { useContext } from 'react';
import { GoalsContext } from '../contexts/GoalsContext';

type ReportData = {
  type: string;
  user_email: string;
  goal_ref: string;
  reportDate: string;
};

export function GoalsReport() {
  const { selectedGoal } = useContext(GoalsContext);
  const { reports } = selectedGoal;
  let dismiss = 0;
  let did = 0;
  let alreadyReportedToday = false;

  if (selectedGoal.report_type === 'auto_report') {
    reports.map((report: ReportData) => {
      report.type === 'dismiss' && dismiss++;
      if (report.reportDate === format(new Date(), 'yyyy,MM,dd')) {
        alreadyReportedToday = true;
      }
    });

    return {
      daysCompleted: selectedGoal.daysCompleted - dismiss,
      alreadyReportedToday,
      isCompleted: selectedGoal.daysCompleted - dismiss >= selectedGoal.days,
    };
  } else if (selectedGoal.report_type === 'need_report') {
    reports.map((report: ReportData) => {
      report.type === 'dismiss' ? dismiss++ : did++;
      if (report.reportDate === format(new Date(), 'yyyy,MM,dd')) {
        alreadyReportedToday = true;
      }
    });

    return {
      daysCompleted: did,
      alreadyReportedToday,
      isCompleted: did - dismiss >= selectedGoal.days,
    };
  }
}
