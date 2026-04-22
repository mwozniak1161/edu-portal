'use client';

import { PageHeader } from '@/components/layout/page-header';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuthStore } from '@/store/auth.store';
import { useTimeslots } from '@/lib/api/timeslots';

const DAYS = ['', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function SchedulePage() {
  const user = useAuthStore((s) => s.user);
  const classId = user?.classId ?? undefined;

  const { data: timeslots = [], isLoading } = useTimeslots(undefined, classId);

  const byDay = timeslots.reduce<Record<number, typeof timeslots>>((acc, ts) => {
    if (!acc[ts.weekDay]) acc[ts.weekDay] = [];
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    acc[ts.weekDay]!.push(ts);
    return acc;
  }, {});

  const activeDays = [1, 2, 3, 4, 5, 6, 7].filter((d) => (byDay[d]?.length ?? 0) > 0);

  return (
    <div>
      <PageHeader title="Schedule" description="Your weekly timetable." />

      {!classId && (
        <p className="text-muted-foreground text-sm">You are not assigned to a class yet.</p>
      )}

      {classId && isLoading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      )}

      {classId && !isLoading && timeslots.length === 0 && (
        <p className="text-muted-foreground text-sm">No timeslots found for your class.</p>
      )}

      {classId && !isLoading && activeDays.length > 0 && (
        <div className="space-y-6">
          {activeDays.map((day) => (
            <div key={day}>
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                {DAYS[day]}
              </h2>
              <div className="space-y-2">
                {(byDay[day] ?? []).map((ts) => (
                  <div
                    key={ts.id}
                    className="flex items-center justify-between rounded-lg border bg-card px-5 py-3"
                  >
                    <div>
                      <p className="font-medium">{ts.teacherClass?.subject.name ?? '—'}</p>
                      <p className="text-sm text-muted-foreground font-data">
                        {ts.teacherClass?.teacher
                          ? `${ts.teacherClass.teacher.firstName} ${ts.teacherClass.teacher.lastName}`
                          : '—'}
                      </p>
                    </div>
                    <div className="text-right text-sm text-muted-foreground">
                      <p className="font-mono">
                        {new Date(ts.startingHour).toTimeString().slice(0, 5)}
                      </p>
                      <p className="font-data">{ts.length} min</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
