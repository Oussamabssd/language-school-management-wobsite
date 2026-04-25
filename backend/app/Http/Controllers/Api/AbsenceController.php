<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\AbsenceRequest;
use App\Http\Resources\AbsenceResource;
use App\Services\AbsenceService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AbsenceController extends Controller
{
    public function __construct(private AbsenceService $absenceService) {}

    public function index(Request $request): JsonResponse
    {
        return $this->success(AbsenceResource::collection($this->absenceService->getAll($request->input('per_page', 15)))->response()->getData(true));
    }

    public function store(AbsenceRequest $request): JsonResponse
    {
        $data = $request->validated();
        if (!isset($data['marked_by'])) {
            $data['marked_by'] = auth()->id();
        }
        return $this->success(new AbsenceResource($this->absenceService->create($data)), 'Absence marked', 201);
    }

    public function markBulk(Request $request): JsonResponse
    {
        $request->validate([
            'timetable_id' => ['required', 'exists:timetables,id'],
            'date' => ['required', 'date'],
            'absences' => ['required', 'array'],
            'absences.*.student_id' => ['required', 'exists:users,id'],
            'absences.*.status' => ['required', 'in:absent,late,excused,present'],
            'absences.*.reason' => ['nullable', 'string'],
        ]);

        $timetable = \App\Models\Timetable::findOrFail($request->timetable_id);
        $markerId = auth()->id();

        foreach ($request->absences as $absenceData) {
            \App\Models\Absence::updateOrCreate(
                [
                    'student_id' => $absenceData['student_id'],
                    'timetable_id' => $request->timetable_id,
                    'date' => $request->date,
                ],
                [
                    'group_id' => $timetable->group_id,
                    'course_id' => $timetable->course_id,
                    'status' => $absenceData['status'],
                    'reason' => $absenceData['reason'] ?? null,
                    'marked_by' => $markerId,
                ]
            );
        }

        return $this->success(null, 'Attendance updated for the session');
    }

    public function show(int $id): JsonResponse
    {
        return $this->success(new AbsenceResource($this->absenceService->getById($id)));
    }

    public function update(AbsenceRequest $request, int $id): JsonResponse
    {
        return $this->success(new AbsenceResource($this->absenceService->update($id, $request->validated())), 'Absence updated');
    }

    public function destroy(int $id): JsonResponse
    {
        $this->absenceService->delete($id);
        return $this->success(null, 'Absence deleted');
    }

    public function byStudent(int $studentId): JsonResponse
    {
        return $this->success(AbsenceResource::collection($this->absenceService->getByStudent($studentId)));
    }

    public function byTimetable(int $timetableId, string $date): JsonResponse
    {
        $absences = \App\Models\Absence::where('timetable_id', $timetableId)
            ->where('date', $date)
            ->get();
        return $this->success(AbsenceResource::collection($absences));
    }

    public function byGroup(int $groupId, Request $request): JsonResponse
    {
        return $this->success(AbsenceResource::collection($this->absenceService->getByGroup($groupId, $request->input('date'))));
    }
}
