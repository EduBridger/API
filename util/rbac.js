export const permissions = [
    {
        role: 'student',
        actions: [
            'get_profile',
            'update_profile',
            'get_course',
            'get_courses',
            'view_teachers'
        ]
    },
    {
        role: 'teacher',
        actions: [
            'get_profile', 
            'update_profile',
            'get_course',
            'get_courses',
            'view_students',
            'grade_students',
            'create_course_content',
            'update_course_content'
        ]
    },
    {
        role: 'admin',
        actions: [
            'get_profile',
            'update_profile',
            'create_student',
            'update_student', 
            'delete_student',
            'view_students',
            'create_teacher',
            'update_teacher',
            'delete_teacher',
            'view_teachers',
            'create_course',
            'update_course',
            'delete_course',
            'view_courses'
        ]
    }
];

