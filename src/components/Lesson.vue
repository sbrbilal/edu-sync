<template>
    <div>
        <div class="flex flex-col items-center justify-between md:flex-row">
            <div class="flex flex-col w-full mb-4 md:mb-0 md:w-auto">
                <label for="search" class="block text-sm font-medium leading-6 text-gray-900">Search</label>
                <input type="search" :value="query" @input="$emit('query', $event.target.value)" name="search" id="search"
                    class="block w-full md:w-72 rounded-md border-0 py-2 px-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    placeholder="Search">
            </div>
            <div class="flex items-center justify-between w-full space-x-3 md:w-auto">
                <label for="sortBy" class="block text-sm font-medium text-gray-900 whitespace-nowrap">
                    Sort by:
                </label>
                <select @change="$emit('sort', $event.target.value)" name="sortBy"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                    <option :value="attribute.key" :selected="sortBy === attribute.key"
                        v-for="(attribute, attributeIndex) in sortList" :key="attributeIndex">
                        {{ attribute.value }}
                    </option>
                </select>
                <label for="sortOrder" class="block text-sm font-medium text-gray-900 whitespace-nowrap">
                    Order:
                </label>
                <select @change="$emit('sortOrder', $event.target.value)" name="sortOrder"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                    <option :selected="'asc' === sortOrder" value="asc">Ascending</option>
                    <option :selected="'desc' === sortOrder" value="desc">Descending</option>
                </select>
            </div>
        </div>
        <div class="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8" v-if="lessons.length">
            <div class="group relative" v-for="(lesson, lessonIndex) in lessons" :key="lessonIndex">
                <div
                    class="aspect-h-1 aspect-w-1 h-48 w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75">
                    <img :src="`${backendLink}${lesson.image}`" :alt="lesson.subject"
                        class="h-full w-full object-cover object-center lg:h-full lg:w-full">
                </div>
                <div class="mt-4 space-y-1 flex flex-col justify-start">
                    <h3 class="text-gray-900">
                        {{ lesson.subject }} - <span class="text-sm font-semibold">{{ lesson.location }}</span>
                    </h3>
                    <p class="text-sm text-gray-500 line-clamp-2">{{ lesson.description }}</p>
                    <div class="flex items-center justify-between">
                        <p class="flex items-center space-x-2 text-lg font-medium text-gray-900">
                            <span class="text-xs">Price:</span>
                            <span>£{{ lesson.price }}</span>
                        </p>
                        <p class="flex items-center space-x-2 text-lg font-medium text-gray-900">
                            <span class="text-xs">Space:</span>
                            <span>{{ lesson.spaces }}</span>
                        </p>
                    </div>
                    <button :disabled="lesson.spaces === 0" type="button" class="bg-gray-200 rounded py-2 hover:bg-gray-300"
                        :class="{
                            'cursor-not-allowed': lesson.spaces === 0
                        }" @click="$emit('add', lesson._id)">
                        {{ lesson.spaces === 0 ? 'Sold out!' : 'Add to cart' }}
                    </button>
                </div>
            </div>
        </div>
        <p class="text-center mt-6" v-else>
            No lessons found {{ query ? `for "${query}"` : '' }}
        </p>
    </div>
</template>

<script>
export default {
    props: {
        backendLink: {
            type: String,
            required: true
        },
        query: {
            type: String,
            default: ''
        },
        sortBy: {
            type: String,
            default: ''
        },
        sortOrder: {
            type: String,
            default: ''
        },
        sortList: {
            type: Array,
            default() {
                return []
            }
        },
        lessons: {
            type: Array,
            default() {
                return []
            }
        }
    }
}
</script>
