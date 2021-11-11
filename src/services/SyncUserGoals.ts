import { fauna } from '../services/fauna';
import { query as q } from 'faunadb';
import { format, differenceInDays } from 'date-fns';
interface SyncUserGoalsProps {
  id?: string;
  user?: {
    email?: string;
    name?: string;
    image?: string;
  };
}

type UserFauna = {
  ref: {
    value: {
      id: string;
    };
  };
  data: {
    email: string;
    name: string;
    image: string;
    id: string;
  };
};

type GoalsData = {
  data: {
    data: {
      description: string;
      start_date: string;
      end_date: string;
      report_type: string;
      category: string;
      user_email: string;
      user_id: string;
    };
    ref: {
      value: {
        id: string;
      };
    };
  }[];
};

type CategoryData = {
  data: {
    data: {
      description: string;
      user_email: string;
    };
    ref: {
      value: {
        id: string;
      };
    };
  }[];
};

type ReportsData = {
  data: {
    data: {
      type: string;
      user_email: string;
      goal_ref: string;
      reportDate: string;
    };
  }[];
};

interface GoalsFomattedProps {
  goals: GoalsData;
  category: CategoryData;
  goalsReports: ReportsData;
}

type GoalsDataReturn = {
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

function reportsFiltered(reports: ReportsData, goalRef: string) {
  let reportsFiltered = [];

  const reportsTemp = reports.data.map((report) => {
    if (report.data.goal_ref === goalRef) {
      reportsFiltered.push({ ...report.data });
    }
  });
  return reportsFiltered;
}

function goalsObjectFiltered(goalsFilter: GoalsData, catId: string, goalReports: ReportsData) {
  let goalFiltered = [];

  function daysCompleted(startDate: string, endDate: string) {
    const dateNow = format(new Date(), 'yyyy,MM,dd');

    if (
      differenceInDays(
        new Date(dateNow.split(',').join('/')),
        new Date(endDate.split(',').join('/'))
      ) >= 0
    ) {
      return differenceInDays(
        new Date(endDate.split(',').join('/')),
        new Date(startDate.split(',').join('/'))
      );
    } else {
      return differenceInDays(Date.now(), new Date(startDate.split(',').join('/')));
    }
  }

  const goalstemp = goalsFilter.data.map((goal) => {
    if (goal.data.category === catId) {
      goalFiltered.push({
        ref: goal.ref.value.id,
        description: goal.data.description,
        end_date: goal.data.end_date,
        start_date: goal.data.start_date,
        days: differenceInDays(
          new Date(goal?.data?.end_date.split(',').join('/')),
          new Date(goal?.data?.start_date.split(',').join('/'))
        ),
        daysCompleted: daysCompleted(goal.data.start_date, goal.data.end_date),
        report_type: goal.data.report_type,
        category: goal.data.category,
        reports: reportsFiltered(goalReports, goal.ref.value.id),
      });
    }
  });

  return goalFiltered;
}

async function formattedGoals({
  goals,
  category,
  goalsReports,
}: GoalsFomattedProps): Promise<GoalsDataReturn> {
  let goalsFormatted = [];
  const goalsFormat = category.data.map((cat) => {
    goalsFormatted.push({
      description: cat.data.description,
      ref: cat.ref.value.id,
      goals: goalsObjectFiltered(goals, cat.ref.value.id, goalsReports),
    });
  });
  return Object(goalsFormatted);
}

export const SyncUserGoals = async (session: SyncUserGoalsProps) => {
  if (session?.id) {
    const user = await fauna.query<UserFauna>(q.Get(q.Match(q.Index('users_by_id'), session.id)));
    if (user.data.email === session.user.email && user.data.id === session.id) {
      const goals = await fauna.query<GoalsData>(
        q.Map(
          q.Paginate(q.Match(q.Index('goals_by_user_email'), user.data.email)),
          q.Lambda('X', q.Get(q.Var('X')))
        )
      );

      if (goals.data.length === 0) {
        return {} as GoalsDataReturn;
      }

      const category = await fauna.query<CategoryData>(
        q.Map(
          q.Paginate(q.Match(q.Index('category_by_user_email'), user.data.email)),
          q.Lambda('X', q.Get(q.Var('X')))
        )
      );
      const goalsReports = await fauna.query<ReportsData>(
        q.Map(
          q.Paginate(q.Match(q.Index('reports_by_user_email'), user.data.email)),
          q.Lambda('X', q.Get(q.Var('X')))
        )
      );

      const goalsFormatted = await formattedGoals({ goals, category, goalsReports });

      return goalsFormatted;
    }
  }
};
