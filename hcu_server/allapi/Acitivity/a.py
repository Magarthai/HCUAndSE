def add_queue(queue_list, new_id):
    if not queue_list:
        queue_list.append({'id': new_id, 'queue': 'A001'})
    else:
        last_queue = queue_list[-1]['queue']
        queue_number = int(last_queue[1:]) + 1
        new_queue = 'A' + str(queue_number).zfill(3)
        queue_list.append({'id': new_id, 'queue': new_queue})

# ตัวอย่างการใช้งาน
queue_list = [{'id': 65090500416, 'queue': 'A001'}, {'id': 64090500420, 'queue': 'A002'}]
new_id = 66090500418
add_queue(queue_list, new_id)
print(queue_list)
