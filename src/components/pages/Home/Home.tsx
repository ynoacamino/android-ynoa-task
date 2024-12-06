import { IonPage } from '@ionic/react';
import { Button } from '@/components/ui/button';
import { useTask } from '@/components/providers/TaskProvider';
import { LinkButton } from '@/components/ui/LinkButton';
import { Virtuoso } from 'react-virtuoso';
import Header from '../global/Header';
import Tasks from './Tasks';

function Home() {
  const { getGroupTasks, clearTasks } = useTask();

  const tasks = Object.entries(getGroupTasks());

  return (
    <IonPage>
      <div className="flex flex-col">
        <Header title="ynoaTask" />
        <div className="flex flex-col gap-6">
          <Virtuoso
            style={{ height: 'calc(100vh - 160px)' }}
            totalCount={tasks.length}
            itemContent={
                // eslint-disable-next-line react/no-unstable-nested-components
                (index) => (
                  <Tasks
                    key={tasks[index][0]}
                    date={tasks[index][0]}
                    tasks={tasks[index][1]}
                  />
                )
              }
          />
        </div>
        <div className="flex gap-4 my-4 px-4 items-center justify-end">
          <Button className="" onClick={clearTasks}>
            Clear
          </Button>
          <LinkButton className="" to="add">
            Add Task
          </LinkButton>
        </div>
      </div>
    </IonPage>
  );
}

export default Home;
