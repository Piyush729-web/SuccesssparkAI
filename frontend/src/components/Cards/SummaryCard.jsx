import { LuTrash2 } from 'react-icons/lu';
import { getInitials } from '../../utils/helper';

const SummaryCard = ({
    colors, role, topicsToFocus, experience, questions, description, lastUpdated, onSelect, onDelete,
}) => {
    return <div
        className='bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-xl p-3 overflow-hidden cursor-pointer hover:shadow-lg shadow-zinc-200/50 dark:shadow-zinc-900/50 hover:-translate-y-1 transition-all duration-300 relative group'
        onClick={onSelect}
    >
        <div
            className='rounded-lg p-5 cursor-pointer relative'
            style={{
                background: colors.bgcolor,
            }}>
            <div className='flex items-start'>
                <div className='flex-shrink-0 w-12 h-12 bg-white rounded-md flex items-center justify-center mr-4'>
                    <span className='text-lg font-semibold text-black'>
                        {getInitials(role)}
                    </span>
                </div>

                {/* Content Container */}
                <div className='flex-grow'>
                    <div className='flex justify-between items-start'>
                        {/* Title and Skills */}
                        <div>
                            <h2 className='text-[17px] font-semibold text-black dark:text-black'>
                                {role}
                            </h2>
                            <p className='text-xs text-medium text-black dark:text-black'>
                                {topicsToFocus}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <button
                className='hidden group-hover:flex items-center gap-2 text-xs text-rose-600 dark:text-rose-400 font-medium bg-white dark:bg-gray-800 px-3 py-1.5 rounded-lg text-nowrap border border-rose-100 dark:border-rose-800 hover:border-rose-200 dark:hover:border-rose-700 active:scale-95 transition-all cursor-pointer absolute top-2 right-2'
                onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                }}>
                <LuTrash2 className='text-rose-600 dark:text-rose-400' />
            </button>
        </div>
        <div className='px-3 pb-3'>
            <div className='flex items-center gap-3 mt-4'>
                <div className='text-[10px] font-medium text-gray-900 dark:text-gray-100 px-3 py-1.5 border border-gray-200 dark:border-gray-700 rounded-full '>
                    Experience :{experience}{experience == 1 ? "Year" : "Years"}
                </div>
                <div className='text-[10px] font-medium text-gray-900 dark:text-gray-100 px-3 py-1.5 border border-gray-200 dark:border-gray-700 rounded-full'>
                    Q&A: {questions}
                </div>
                <div className='text-[10px] font-medium text-gray-900 dark:text-gray-100 px-3 py-1.5 border border-gray-200 dark:border-gray-700 rounded-full'>
                    Last Updated: {lastUpdated}
                </div>
            </div>

            {/* Description */}
            <p className='text-[12px] text-gray-600 dark:text-gray-400 font-medium line-clamp-2 mt-3'>
                {description}
            </p>
        </div>
    </div>
}

export default SummaryCard;